import { Request, Response, Router } from 'express';
import { idQuery } from '@whosaidtrue/validation';
import { logger } from '@whosaidtrue/logger';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { decks, games, names } from '../../db';

const router = Router();

// TODO finish
router.post('/join', async (req: Request, res: Response) => {
    const id = req.query.access_code;
})

// TODO finish
router.post('/create', async (req: Request, res: Response) => {
    const { deckId, hostName, userId } = req.body;
})
export default router;