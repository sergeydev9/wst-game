export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

/**
 * Home page slider box. An array of strings representing a conversation.
 */
export interface UserStory {
  lines: string[];
}