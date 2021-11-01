import {Job} from "@whosaidtrue/app-interfaces";
import {logger} from "@whosaidtrue/logger";
import {emailTask} from "./tasks/email.task";

export class TaskResult {
    constructor(
        public readonly status: 'completed' | 'failed',
        public readonly result?: any
    ) {}
}

export interface Task {
    execute: () => PromiseLike<TaskResult>;
}

export function createTask(job: Job): Task {
    if (job.status != 'pending') {
        throw new Error(`Invalid job=${job.id} - expecting type='pending', got type=${job.type}`);
    }

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
            logger.error(`Failing job=${job.id}, type=${job.type} is not supported`);
            return new TaskResult('failed', `Unsupported type=${job.type}`);
        }
    }
}
