import {Email, Job, Template} from "@whosaidtrue/app-interfaces";

import {Task, TaskResult} from "../task";
import {logError, logger} from "@whosaidtrue/logger";
import {emails} from "../db";
import { MailService } from '@sendgrid/mail';

const emailService = new MailService();
emailService.setApiKey(process.env.SG_API_KEY);

export function emailTask(job: Job): Task {
    return {
        execute: async () => {

            // validate
            const errors = [];
            if (job.type != 'email') {
                errors.push(`Invalid job=${job.id} - expecting type='email', got type=${job.type}`);
            }
            if (job.task_table !== 'emails') {
                errors.push(`Invalid job=${job.id} - expecting task_table='emails', got task_table=${job.task_table}`);
            }
            if (job.task_id == null) {
                errors.push(`Invalid job=${job.id} - expecting task_id to be defined`);
            }

            // fetch email details
            const email = (await emails.getDetails(job.task_id)).rows[0] as Email & Template;
            if (!email) {
                errors.push(`Invalid job=${job.id} - expecting id=${job.task_id} to exist in 'emails' table`);
            }

            // validate template_data if used
            let templateDataJson = {};
            if (email.template_key && email.template_data) {
                try {
                    templateDataJson = JSON.parse(email.template_data);
                } catch (e) {
                    errors.push(`Invalid job=${job.id} - failed to JSON parse template_data=${email.template_data}`);
                }
            }

            // fail on errors
            if (errors.length > 0) {
                errors.forEach(e => `emailTask error: ${logger.warn(null, e)}`);
                return new TaskResult('failed', errors.join("\n"));
            }

            // send email
            logger.info(`emailTask sending email job=${job.id}`);
            try {
                const result = await emailService.send({
                    from: email.from || process.env.SG_FROM_EMAIL,
                    to: email.to,
                    cc: email.cc,
                    bcc: email.bcc,
                    subject: email.subject ? email.subject : undefined,
                    text: email.text ? email.text : undefined,
                    html: email.html ? email.html : undefined,
                    templateId: email.sendgrid_template_id ? email.sendgrid_template_id : undefined,
                    dynamicTemplateData: templateDataJson,
                });
                logger.debug(result);

                return new TaskResult('completed', JSON.stringify(result));
            } catch (e) {
                logError("emailTask error", e);
                return new TaskResult('failed', JSON.stringify(e));
            }
        }
    }
}
