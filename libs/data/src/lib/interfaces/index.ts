/**
 * Interfaces matching the schema.
 */
import { MovieRating } from "@whosaidtrue/app-interfaces";

export interface User {
    id: number,
    email: string,
    password: string,
    roles: string[],
    question_deck_credits: number,
    test_account: boolean,
    created_at: Date,
    updated_at: Date
}

export interface GameHost {
    id: number,
    game_id: number,
    player_id: number,
    created_at: Date,
    updated_at: Date
}

export interface Deck {
    id: number,
    name: string,
    sort_order: number,
    clean: boolean,
    age_rating: number,
    movie_rating: MovieRating,
    SFW: boolean,
    status: string,
    description: string,
    purchase_price: string, // needs to be a string with decimals. Postgres will convert to higher precision number in the DB.
    example_question: string,
    created_at: Date,
    updated_at: Date
}

export interface Game {
    id: number,
    access_code: string,
    status: string,
    start_date: Date,
    end_date?: Date
}