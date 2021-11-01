import { Router, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import {
    validateAuth,
    validateResetEmail,
    validateUserUpdate,
    validatePasswordChange,
    validateResetCode,
    validateReset,
    emailOnly
} from '@whosaidtrue/validation';
import { passport, signResetPayload } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, } from '@whosaidtrue/util';
import { signUserPayload, signGuestPayload } from '@whosaidtrue/middleware';
import { logError } from '@whosaidtrue/logger';
import { users, creditSignup } from '../../db';
import { emailService } from '../../services';
import {
    AccountDetailsResponse,
    AuthenticationRequest,
    AuthenticationResponse,
    ChangePassRequest,
    ResetCodeVerificationRequest,
    ResetCodeVerificationResponse,
    ResetRequest,
    TokenPayload,
    WithEmailBody
} from '@whosaidtrue/api-interfaces';
import { redisClient } from '../../redis';

const router = Router();

/**
 * User log in.
 *
 * Returns a JWT token with type TokenPayload
 */
router.post('/login', [...validateAuth], async (req: Request, res: Response) => {
    const { email, password } = req.body as AuthenticationRequest;
    try {
        // DB will compare passwords
        const { rows } = await users.login(email, password);

        // array empty if password or email are wrong.
        if (!rows.length) {
            res.status(401).send("Invalid login credentials");

        } else {
            // send token if success
            const { id, email, roles } = rows[0]
            const token = signUserPayload({ id, email, roles })

            res.status(201).json({ token } as AuthenticationResponse);
        }
    } catch (e) {
        logError('Error during login', e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }

})


/**
 * New user registration.
 */
router.post('/register', [...validateAuth], async (req: Request, res: Response) => {
    const { email, password } = req.body as AuthenticationRequest;
    try {
        // Register new user.
        const { rows } = await users.register(email, password);

        // send token if success
        const { id, roles } = rows[0]
        const token = signUserPayload({ email: rows[0].email, id, roles })
        res.status(201).json({ token } as AuthenticationResponse)

    } catch (e) {
        // if email already in use
        if (e.message === "duplicate key value violates unique constraint \"users_email_key\"") {
            res.status(422).send("A user already exists with that email")
        } else {
            logError('Error during registration', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }
    }
})

/**
 * Get full account details
 */
router.get('/details', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;

    try {
        const { rows } = await users.getDetails(id);

        // If a user deletes their account, but still manages
        // to send a request to this endpoint with a valid token.
        // This can happen if there is an error deleting the token
        // from the user's browser when they delete their account.
        if (!rows[0]) {
            res.status(404).send('Could not find information for that account')
        } else {
            res.status(200).json(rows[0] as AccountDetailsResponse)
        }
    } catch (e) {
        logError('Error fetching details', e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


/**
 * Update user profile
 */
router.patch('/update', [...validateUserUpdate], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const { email } = req.body as WithEmailBody;
    try {
        const { rows } = await users.updateDetails(id, { email });
        const response: WithEmailBody = { email: rows[0].email }
        res.status(200).json(response)
    } catch (e) {
        if (e.message === "duplicate key value violates unique constraint \"users_email_key\"") {
            res.status(422).send("A user already exists with that email")
        } else {
            logError('Error updating profile', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }
    }
})

router.patch('/change-password', [...validatePasswordChange], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const { oldPass, newPass } = req.body as ChangePassRequest;

    try {
        const { rows } = await users.changePassword(id, oldPass, newPass);
        if (!rows.length) {
            res.status(401).send('Invalid Credentials')
        } else {
            res.status(204).send()
        }
    } catch (e) {
        logError('Error changing password', e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


/**
 * Send a reset token to user email
 *
 * Uses Redis to limit users to 3 resets every 24 hours.
 *
 * If user's reset count is above 3, responds with 403 and 'Rest limit reached'.
 * The front end depends on exactly this response to show the correct error.
 */
router.post('/send-reset', [...validateResetEmail], async (req: Request, res: Response) => {
    const { email } = req.body as WithEmailBody;
    const code = `${Math.floor(1000 + Math.random() * 9000)}` // generate a random 4 digit string.

    try {

        const resetKey = `resetRequests:${email}`;

        // check Redis for reset requests. Returns value after increment
        const resetCount = await redisClient.incr(resetKey);

        if (resetCount > 3) {
            return res.status(403).send('Reset limit reached')
        }

        // expire the key
        const ONE_DAY = 60 * 60 * 24 // in seconds
        await redisClient.expire(resetKey, ONE_DAY);

        const { rows } = await users.upsertResetCode(email, code);

        // if no user was updated, that account doesn't exist
        if (!rows.length) {
            return res.status(404).send('Could not find a user with that email')
        } else {

            // if code was set, send reset email
            const resetResponse = await emailService.sendResetCode(rows[0].email, code);

            // Sendgrid responds with 202 if email was sent
            if (resetResponse[0].statusCode === 202) {
                return res.status(202).send('Reset code sent')
            } else {
                logError('Error while attempting to send password reset email', resetResponse);
                return res.status(500).send(ERROR_MESSAGES.unexpected)
            }
        }
    } catch (e) {
        logError('Error sending reset code', e)
        return res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

/**
 * Check that a user's password reset code is correct.
 * If it is, return a signed JWT token containing the user's
 * email address.
 */
router.post('/validate-reset', [...validateResetCode], async (req: Request, res: Response) => {
    const { email, code } = req.body as ResetCodeVerificationRequest;

    try {
        const { rows } = await users.verifyResetCode(email, code);

        // if nothing was returned, code or email was incorrect.
        // It should never be the email that was wrong given how
        // it's built on the client side.
        if (!rows.length) {
            res.status(401).send('code verification failed')
        } else {
            const { user_email } = rows[0]
            const resetToken = signResetPayload(user_email);
            res.status(202).json({ resetToken } as ResetCodeVerificationResponse)
        }
    } catch (e) {
        logError('Error validating reset code', e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

/**
 * Final step in password reset process. Get token and new
 * password from request body. Validate token. If token valid,
 * reset pass and send auth token.
 */
router.patch('/reset', [...validateReset], async (req: Request, res: Response) => {
    const { password, resetToken } = req.body as ResetRequest;
    try {
        // using a token here guarantees that the reset code submitted
        // earlier was verified by the server, and the user has permission
        // to set a new password.
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET) as { email: string };
        const updatedUser = await users.resetPassword(decoded.email, password);

        // send token if success
        const { id, email, roles } = updatedUser;
        const token = signUserPayload({ id, email, roles })
        res.status(202).json({ token } as AuthenticationResponse);

    } catch (e) {

        if (e instanceof JsonWebTokenError) {
            res.status(401).send('Unauthorized')
        } else {
            logError('Error resetting password', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }

    }


})

/**
 * Register guest user
 */
router.post('/guest', [...emailOnly], async (req: Request, res: Response) => {
    try {
        const { rows } = await users.createGuest(req.body.email);
        const { id, email, roles } = rows[0]
        const token = signGuestPayload({ id, email, roles }) // token only valid for 1 day

        res.status(201).json({ token } as AuthenticationResponse);

    } catch (e) {
        if (e.message === "duplicate key value violates unique constraint \"users_email_key\"") {
            res.status(422).send("A user already exists with that email")
        } else {
            logError('Error registering guest', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }
    }
})

/**
 * Save a free credit signup request for a specfied email
 */

router.post('/free-credit-signup', [...emailOnly], async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const { rowCount } = await creditSignup.insertOne(email);

        if (rowCount) {
            return res.status(201).send();
        }

        return res.status(500).send(ERROR_MESSAGES.unexpected);

    } catch (e) {
        if (e.message === "duplicate key value violates unique constraint \"free_credit_signups_email_key\"") {
            res.status(422).send("email has already received free credits")
        } else {
            logError('Error in free credit signup', e)
            res.status(500).send(ERROR_MESSAGES.unexpected)
        }
    }
})

export default router;