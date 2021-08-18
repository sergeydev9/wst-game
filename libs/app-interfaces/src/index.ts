/**
 * Home page slider box. An array of strings representing a conversation.
 */
export interface UserStory {
    lines: string[];
}

export type QuestionStatus = 'active' | 'inactive' | 'poll';
export type UserRating = 'great' | 'bad';
export type DeckStatus = 'active' | 'inactive' | 'pending';
export type AnswerValue = 'true' | 'false' | 'pass';
export type UserRole = 'user' | 'admin';

/**
 * type of objects for insertOne functions is always going to be the
 * type of the object minus id, created_at and updated_at columns.
 * this type function just makes it easy to construct those types.
 */
export type Insert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type used to define the movie rating column on decks
 */
export type MovieRating = 'G' | 'PG' | 'PG-13' | 'R' //TODO: check what actual possible values are.

/**
 * This type is a union of the names of the theme colors. Used to type variables that must
 * be one of the theme's color options
 */
export type ThemeColor = 'primary'
    | 'subtle-stroke'
    | 'subtle-primary'
    | 'subtle-bg'
    | 'basic-black'
    | 'white-ish'
    | 'true-white'
    | 'green-base'
    | 'green-subtle-stroke'
    | 'green-subtle'
    | 'red-base'
    | 'red-subtle-stroke'
    | 'red-subtle'
    | 'red-light';

export interface User {
    id: number;
    email: string;
    password: string;
    roles: UserRole[];
    question_deck_credits: number;
    test_account: boolean;
    created_at?: Date;
    updated_at?: Date
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
    thumbnail_url?: string;
    purchase_price: string; // needs to be a string with decimals. Postgres will convert to higher precision number in the DB.
    example_question?: string;
    created_at?: Date;
    updated_at?: Date
}

export interface Game {
    id: number;
    access_code: string;
    status: string;
    deck_id: number;
    start_date?: Date;
    end_date?: Date;
    created_at?: Date;
    updated_at?: Date
}

export interface Question {
    id: number;
    text: string;
    text_for_guess: string;
    follow_up: string;
    deck_id: number;
    age_rating: number;
    status: QuestionStatus;
    created_at?: Date;
    updated_at?: Date
}

export interface GameAnswer {
    id: number;
    game_player_id: number;
    game_question_id: number;
    game_id: number;
    value: AnswerValue;
    number_true_guess: number;
    score?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserSession {
    id: number;
    user_id: number;
    ip_address: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserDeck {
    id: number;
    user_id: number;
    deck_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GeneratedName {
    id: string;
    name: string;
    clean: boolean;
    times_displayed: number;
    times_chosen: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GameUser {
    id: number;
    user_id: number;
    game_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface GamePlayer {
    id: number;
    player_name: string;
    game_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface Order {
    id: number;
    user_id: number;
    deck_id: number;
    purchase_price: number;
    fulfilled_on?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserQuestionRating {
    id: number;
    user_id: number;
    question_id: number;
    rating: UserRating;
    created_at?: Date;
    updated_at?: Date;
}

export type IInsertUserQuestionRating = Insert<UserQuestionRating>;
export type IInsertQuestionRating = Insert<UserQuestionRating>;
export type IInsertOrder = Insert<Order>;
export type IInsertGamePlayer = Insert<GamePlayer>;
export type IInsertGameUsers = Insert<GameUser>;
export type IInsertGeneratedName = Insert<GeneratedName>;
export type IInsertUserDeck = Insert<UserDeck>;
export type IInsertSession = Insert<UserSession>;
export type IInsertAnwser = Insert<GameAnswer>;
export type IInsertDeck = Insert<Deck>;
export type IInsertQuestion = Insert<Question>;
export type IInsertGame = Insert<Game>;