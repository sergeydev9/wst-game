import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { Request, Response, Router } from 'express';
import { validateNameReport } from '@whosaidtrue/validation';
import { names } from '../../db';
import { NameChoiceReport } from '@whosaidtrue/api-interfaces';
import { logger } from '@whosaidtrue/logger';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { rows } = await names.getChoices(6)
        res.status(200).json({ names: rows })
    } catch (e) {
        res.status(500).send(ERROR_MESSAGES.unexpected)
    }
})

router.patch('/report', [...validateNameReport], async (req: Request, res: Response) => {
    const { seen, chosen } = req.body as NameChoiceReport;
    try {
        await Promise.all(names.reportChoices(seen, chosen));
    } catch (e) {
        logger.error(e)
    } finally {
        // client doesn't need to know what happens to this report.
        // Send 204 even if error.
        res.status(204).send()
    }
})

export default router