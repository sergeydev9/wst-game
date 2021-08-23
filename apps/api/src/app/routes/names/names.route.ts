import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { Request, Response, Router } from 'express';
import { names } from '../../db';

const router = Router();

// TODO: write tests for this
router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await names.getChoices(6)
        res.status(200).json({ names: rows })
    } catch (e) {
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})
export default router