import { MailService } from '@sendgrid/mail';

class Email {
  private readonly _service: MailService;

  constructor(private readonly _sgKey: string, private readonly fromAddress: string) {
    this._service = new MailService();
    this._service.setApiKey(this._sgKey);
  }

  public sendEmail(htmlContent: string, subject: string, recipient: string, fromAddress?: string) {
    /**
     * This function will never work in dev or test. Environemnt variables will
     * only be set in prod as encrypted secrets, so remember to always mock this function
     * in any tests that call it.
     */

    const email = {
      from: fromAddress || this.fromAddress, // override if address included
      to: recipient,
      subject: subject,
      html: htmlContent,
    };
    return this._service.send(email)
  }


  public sendResetCode(recipientEmail: string, code: string) {
    const subject = 'Who Said True? - Password Reset';
    const content = `
        <html>
          <body>
            <center style="background-color: #eaeaea; width: 24rem; margin: auto; padding: 4rem">
              <h1>Who Said True?</h1>
              <p>Someone has requested a password reset for your account at whosaidtrue.com.</p>
              <h2>Your reset code is: <blockquote>${code}</blockquote></h2>
              <p>If you did not expect this email, please feel free to ignore it.</p>
            </center>
          </body>
        </html>
      `;
    return this.sendEmail(content, subject, recipientEmail);
  }


}

export default Email;