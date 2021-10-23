import {Email, Job} from "@whosaidtrue/app-interfaces";

import {Task, TaskResult} from "../task";
import {logger} from "@whosaidtrue/logger";
import {emails} from "../db";

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
            const email = (await emails.getById(job.task_id)).rows[0] as Email;
            if (!email) {
                errors.push(`Invalid job=${job.id} - expecting id=${job.task_id} to exist in 'emails' table`);
            }

            // fail on errors
            if (errors.length > 0) {
                // errors.forEach(e => logger.warn(null, e));
                return new TaskResult('failed', errors.join("\n"));
            }

            // TODO send email
            logger.info(`TODO: sending email job ${job.id}`);

            return new TaskResult('completed', 'TODO');
        }
    }
}
