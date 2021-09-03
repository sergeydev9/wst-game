import { Email } from '@whosaidtrue/email';
export * from './purchase';

export const emailService = new Email(process.env.SG_API_KEY, 'no-reply@whosaidtrue.com') // TODO: check if this is the address they want to use