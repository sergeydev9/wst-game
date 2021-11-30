import { Request, Response, Router } from 'express';
import { logError } from '@whosaidtrue/logger';
import validator from 'validator';
import { emailMessage } from '@whosaidtrue/validation';
import { ERROR_MESSAGES } from '@whosaidtrue/util';
import { EmailRequest } from '@whosaidtrue/api-interfaces';
import { InsertEmail } from '@whosaidtrue/app-interfaces';
import { emails } from '../../db';
import { getDomain } from '../../getDomain';
import extractOptionalId from '../../extractOptionalId';

const router = Router();

/**
 * Inserts a message into emails table for processing by the email worker.
 */
router.post('/', [...emailMessage], async (req: Request, res: Response) => {
    const { email, name, message, category } = req.body as EmailRequest;
    const id = extractOptionalId(req);
    const domain = getDomain(req);

    try {
        const emailData: InsertEmail = {
            user_id: id,
            to: process.env.EMAIL_RECIPIENT || 'brian@whosaidtrue.com',
            cc: email,
            // remove https:// from domain to avoid inserting escape characters. Otherwise this will become https:&#x2F;&#x2F;
            subject: validator.escape(`[${category}] - Sent by ${name} from ${domain.replace('https://', '')}`),
            text: validator.escape(message) // removes JS so that whoever opens these emails doesn't get hacked
        }

        await emails.enqueue(emailData);
        res.sendStatus(201);
    } catch (e) {
        logError('Error while sending email message', {
            endpoint: '[POST] /emails',
            err: e
        })
        res.status(500).send(ERROR_MESSAGES.unexpected);
    }
})

export default router;