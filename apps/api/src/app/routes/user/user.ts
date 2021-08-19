import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { validateAuth, passport } from '@whosaidtrue/middleware';
import { users } from '../../db';

const router = Router();

/**
 * User log in route.
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
            const token = jwt.sign({ user: rows[0] }, process.env.JWT_SECRET, { expiresIn: '1w' });
            res.status(200).json({ token });
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("An unexpected error occured during login. Please try again later.")
    }

})


/**
 * New user registration.
 */
router.post('/register', ...validateAuth, async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const { rows } = await users.register(email, password);

        // array empty if password or email are wrong.
        if (!rows.length) {
            res.status(401).send("Invalid login credentials")

        } else {
            // send token if success
            const token = jwt.sign({ user: rows[0] }, process.env.JWT_SECRET, { expiresIn: '1w' })
            res.status(200).json({ token })
        }
    } catch (e) {
        console.error(e)
        res.status(500).send("An unexpected error occured during login. Please try again later.")
    }
})

/**
 * Update user profile
 */
// router.put('/update', passport.authenticate(), (req: Request, res: Response) => {

// })



export default router;