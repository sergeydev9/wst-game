import { Email } from '@whosaidtrue/email';

export const emailService = new Email(process.env.SG_API_KEY, process.env.SG_FROM_EMAIL);