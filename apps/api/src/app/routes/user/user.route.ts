import { Router, Request, Response } from 'express';
import { validateAuth, validateReset, validateUserUpdate, validatePasswordChange } from '@whosaidtrue/validation';
import { passport } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, } from '@whosaidtrue/util';
import { signUserPayload } from '@whosaidtrue/middleware';
import { logger } from '@whosaidtrue/logger';
import { users } from '../../db';
import { AccountDetailsResponse, ChangePassRequest, TokenPayload, UpdateDetailsResponse } from '@whosaidtrue/api-interfaces';

const router = Router();

/**
 * User log in.
 *
 * Returns a JWT token with type TokenPayload
 */
router.post('/login', [...validateAuth], async (req: Request, res: Response) => {
    const { email, password } = req.body;
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

            res.status(201).json({ token });
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }

})


/**
 * New user registration.
 */
router.post('/register', [...validateAuth], async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        // Will throw if user already exists with that email.
        const { rows } = await users.register(email, password);

        // send token if success
        const { id, roles } = rows[0]
        const token = signUserPayload({ email: rows[0].email, id, roles })
        res.status(201).json({ token })

    } catch (e) {
        if (e.message === "duplicate key value violates unique constraint \"users_email_key\"") {
            res.status(422).send("A user already exists with that email")
        } else {
            logger.error(e)
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
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


/**
 * Update user profile
 */
router.patch('/update', [...validateUserUpdate], passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    const { id } = req.user as TokenPayload;
    const { email } = req.body;
    try {
        const { rows } = await users.updateDetails(id, { email });
        const response: UpdateDetailsResponse = { email: rows[0].email }
        res.status(200).json(response)
    } catch (e) {
        if (e.message === "duplicate key value violates unique constraint \"users_email_key\"") {
            res.status(422).send("A user already exists with that email")
        } else {
            logger.error(e)
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
            res.status(204).send('Password change successful')
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


/**
 * Send a reset token to user email
 */
// router.patch('/send-reset', [...validateReset], async (req: Request, res: Response) => {
// TODO: implement reset tokens.
// })


/**
 * Delete user account.
 *
 * Account ID is taken from JWT payload.
 */
// router.delete('/delete', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
//     try {
//         // get user id from token
//         const { id } = req.user as TokenPayload
//         const { rows } = await users.deleteById(id)

//         // if account deleted, count will be 1
//         if (rows[0].count === 1) {
//             res.status(204).send();
//         } else {
//             // This shouldn't be possible, but just in case...
//             logger.error(`a deleteById request for user with id ${id} returned count ${rows[0].count}. This shouldn't happen.`)
//             res.status(500).send("Unable to delete account")
//         }
//     } catch (e) {
//         logger.error(e)
//         res.status(500).send(ERROR_MESSAGES.unexpected)
//     }
// })


export default router;