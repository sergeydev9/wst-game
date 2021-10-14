/**
 * Home page slider box. An array of strings representing a conversation.
 */

export type SendMessageFunction = (type: string, payload?: unknown, ack?: (...args: unknown[]) => void) => void;

export interface UserStory {
    lines: string[];
}

export interface UserInsertObject {
    email: string;
    password: string;
    role: UserRole
}

export type RequestStatus = 'idle' | 'loading';
export type QuestionStatus = 'active' | 'inactive' | 'poll';
export type UserRating = 'great' | 'bad';
export type DeckStatus = 'active' | 'inactive' | 'pending';
export type AnswerValue = 'true' | 'false' | 'pass';
export type UserRole = 'user' | 'admin' | 'test' | 'guest';

export type GameStatus = 'lobby'
    | 'inProgress'
    | 'postGame'
    | 'finished'

/**
 * Status of game for the user on front end.
 */
export type UserGameStatus = 'notInGame'
    | 'gameCreateSuccess'
    | 'removed'
    | 'inGame'
    | 'gameCreateError'
    | 'choosingName'
    | 'lobby'


/**
 * This status controls what screen players should be seeing in game.
 */
export type GameQuestionStatus = 'question' | 'results' | 'answer' | '';

/**
 * type of objects for insertOne functions is always going to be the
 * type of the object minus id, created_at and updated_at columns.
 * this type function just makes it easy to construct those types.
 */
export type Insert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/**
 * Type used to define the movie rating column on decks
 */
export type MovieRating = "PG" | "PG13" | "R"


/**
 * This type is a union of the names of the theme colors. Used to type variables that must
 * be one of the theme's color options
 */
export type ThemeColor = 'purple-light'
    | 'purple-base'
    | 'purple-dark'
    | 'purple-gradient'
    | 'purple-subtle-fill'
    | 'purple-subtle-stroke'
    | 'purple-card-bg'
    | 'yellow-base'
    | 'yellow-dark'
    | 'blue-base'
    | 'white-ish'
    | 'true-white'
    | 'basic-black'
    | 'basic-gray'
    | 'light-gray'
    | 'green-base'
    | 'green-subtle-stroke'
    | 'green-subtle-fill'
    | 'red-base'
    | 'red-subtle-stroke'
    | 'red-subtle-fill'
    | 'red-light'

export interface DeckSelectionOptions {
    pageSize: number;
    pageNumber: number;
    ageRating?: number;
}
export interface UserDeckSelectionOptions extends DeckSelectionOptions {
    userId: number;
}

export type ScoreMap = Record<string, PlayerScore>

export interface PlayerScore {
    rank: number;
    name: string;
    points: number;
    rankDiff: number;
}

export interface PlayerRef {
    id: number;
    player_name: string;
}

export interface UserDetailsUpdate {
    email: string
}

export interface NameObject {
    name: string;
    id: number;
    clean: boolean
}

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
    host_name?: string;
    host_id: number;
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
    user_id: number;
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

export type InsertUserQuestionRating = Insert<UserQuestionRating>;
export type InsertQuestionRating = Insert<UserQuestionRating>;
export type InsertOrder = Insert<Order>;
export type InsertGamePlayer = Insert<GamePlayer>;
export type InsertGameUsers = Insert<GameUser>;
export type InsertGeneratedName = Insert<GeneratedName>;
export type InsertUserDeck = Insert<UserDeck>;
export type InsertSession = Insert<UserSession>;
export type InsertAnwser = Insert<GameAnswer>;
export type InsertDeck = Insert<Deck>;
export type InsertQuestion = Insert<Question>;
export type InsertGame = Insert<Game>;

export interface JoinGameResult {
    status: GameStatus
    gameId: number
    deck: Deck,
    currentQuestionIndex: number
    hostName: string,
    access_code: string,
    isHost: boolean,
    playerId: number
    playerName: string,
    totalQuestions: number
}

export interface StartGameResult {
    game: {
        status: GameStatus;
        startDate: Date;
    };
    question: NextQuestionResult
}

export interface NextQuestionResult {
    questionId: number;
    gameQuestionId: number;
    numPlayers: number;
    sequenceIndex: number;
    readerId: number;
    readerName: string;
    followUp: string;
    text: string;
    textForGuess: string;
    globalTrue: number;
}