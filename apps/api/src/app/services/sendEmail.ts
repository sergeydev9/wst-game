import { MailService } from '@sendgrid/mail';

const sgMail = new MailService();
sgMail.setApiKey(process.env.SG_API_KEY);

export const sendResetCode = async (recipientEmail: string, code: string) => {
    const subject = 'Who Said True? - Password Reset';
    const content = `
    !DOCTYPE html>
      <html>
        <body>
          <center style="background-color: #eaeaea; width: 24rem; margin: auto; padding: 4rem">
            <h1>Who Said True?</h1>
            <p>Someone has requested a password reset for your account at whosaidtrue.com.</p>
            <h2>Your reset code is: <blockquote>${code}/blockquote></h2>
            <p>If you did not expect this email, please feel free to ignore it.</p>
          </center>
        </body>
      </html>
    `;
    return sendEmail(content, subject, recipientEmail);
}

export const sendEmail = (htmlContent: string, subject: string, recipient: string) => {
    /**
     * This function will never work in dev or test. Environemnt variables will
     * only be set in prod as encrypted secrets, so remember to always mock this function
     * in any tests that call it.
     */
    const email = {
        from: process.env.NO_REPLY_ADDRESS,
        to: recipient,
        subject: subject,
        html: htmlContent,
    };
    return sgMail.send(email)
}