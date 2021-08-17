/**
 * Interfaces matching the schema.
 */
import { MovieRating, DeckStatus, QuestionStatus, UserRole } from "@whosaidtrue/app-interfaces";

export interface User {
    id: number;
    email: string;
    password: string;
    roles: UserRole[];
    question_deck_credits: number;
    test_account: boolean;
    created_at: Date;
    updated_at: Date
}

export interface Deck {
    id: number;
    name: string;
    sort_order: number;
    clean: boolean;
    age_rating: number;
    movie_rating: MovieRating;
    sfw: boolean;
    status: DeckStatus;
    description: string;
    purchase_price: string; // needs to be a string with decimals. Postgres will convert to higher precision number in the DB.
    example_question: string;
    created_at: Date;
    updated_at: Date
}

export interface Game {
    id: number;
    access_code: string;
    status: string;
    deck_id: number;
    start_date?: Date;
    end_date?: Date;
    created_at: Date;
    updated_at: Date
}

export interface Question {
    id: number;
    text: string;
    text_for_guess: string;
    follow_up: string;
    deck_id: number;
    age_rating: number;
    status: QuestionStatus;
    created_at: Date;
    updated_at: Date
}