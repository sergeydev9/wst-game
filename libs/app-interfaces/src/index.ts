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

/**
 * Type used to define the movie rating column on decks
 */
export type MovieRating = "G" | "PG" | "PG-13" | "R" | "NC-17" | "X"

/**
 * This type is a union of the names of the theme colors. Used to type variables that must
 * be one of the theme's color options
 */
export type ThemeColor = "primary"
    | "subtle-stroke"
    | "subtle-primary"
    | "subtle-bg"
    | "basic-black"
    | "white-ish"
    | "true-white"
    | "green-base"
    | "green-subtle-stroke"
    | "green-subtle"
    | "red-base"
    | "red-subtle-stroke"
    | "red-subtle"
    | "red-light";