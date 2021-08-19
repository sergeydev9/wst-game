import { Router, Request, Response } from 'express';
import { validateAuth, validateReset, passport } from '@whosaidtrue/middleware';
import { ERROR_MESSAGES, signUserPayload } from '@whosaidtrue/util';
import { logger } from '@whosaidtrue/logger';
import { users } from '../../db';
import { TokenPayload } from '@whosaidtrue/api-interfaces';

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
            const { id, email, roles, notifications } = rows[0]
            const token = signUserPayload({ id, email, roles, notifications })

            // TODO: Create a session record here
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
        const { id, roles, notifications } = rows[0]
        const token = signUserPayload({ email: rows[0].email, id, roles, notifications })
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

// TODO: sort out what the user can update on their profile.
/**
 * Update user profile
 */
// router.patch('/set-notifications', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {

// })


/**
 * Send a reset token to user email
 */
router.patch('/send-reset', [...validateReset], async (req: Request, res: Response) => {
    // TODO: implement reset tokens.
})


/**
 * Delete user account.
 *
 * Account ID is taken from JWT payload.
 */
router.delete('/delete', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
    try {
        // get user id from token
        const { id } = req.user as TokenPayload
        const { rows } = await users.deleteById(id)

        // if account deleted, count will be 1
        if (rows[0].count === 1) {
            res.status(204).send();
        } else {
            // This shouldn't be possible, but just in case...
            logger.error(`a deleteById request for user with id ${id} returned count ${rows[0].count}. This shouldn't happen.`)
            res.status(500).send("Unable to delete account")
        }
    } catch (e) {
        logger.error(e)
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})


export default router;