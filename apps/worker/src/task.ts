import {Job} from "@whosaidtrue/app-interfaces";
import {logger} from "@whosaidtrue/logger";

export interface Task {
    execute: () => PromiseLike<'completed' | 'failed'>;
}

export function createTask(job: Job): Task {
    switch (job.type) {
        case 'email':
            return emailTask(job);
        default:
            return unsupportedTask(job)
    }
}

function unsupportedTask(job: Job): Task {
    return {
        execute: async () => {
            logger.error(`unsupported job type ${job.type}, failing...`);
            return 'failed';
        }
    }
}

function emailTask(job: Job): Task {
    return {
        execute: async () => {
            logger.info(`TODO: sending email job ${job.id}`);
            return 'completed';
        }
    }
}
