import { MovieRating } from '@whosaidtrue/app-interfaces';
/**
 * Iterator that yields a given number of strings 'Player Name {INDEX}'.
 *
 * Adds string param "extra" to prevent conflicts between parallel tests.
 *
 * @param {number} num
 * @param {string} extra
 */
export function* testNames(num: number, extra: string) {
    if (num <= 0) {
        throw new Error("num must be above 0")
    }
    let count = 0;

    while (count < num) {
        yield `Player Name ${count + 1} ${extra}`;
        count += 1;
    }
}


/**
 * Generates Deck objects.
 *
 * Adds string param "extra" to prevent conflicts between parallel tests.
 *
 * @export
 * @param {number} num
 * @param {string} extra
 */
export function* testDecks(num: number, extra: string) {
    if (num <= 0) {
        throw new Error("num must be above 0")
    }
    let count = 0;

    while (count < num) {
        yield {
            name: `Test Deck ${extra} ${count + 1}`,
            sort_order: 1,
            clean: true,
            age_rating: 13,
            movie_rating: 'PG-13' as MovieRating,
            sfw: true,
            status: 'active',
            description: 'A deck for testing',
            purchase_price: 1.00,
            example_question: 'An example question',
            thumbnail_url: './placeholder.svg'
        }
        count += 1;
    }
}

/**
 * Generates Game objects.
 *
 * Adds string param "extra" to prevent conflicts between parallel tests.
 *
 * @export
 * @param {number} num
 * @param {string} extra
 * @param {number} deckId
 */
export function* testGames(num: number, extra: string, deckId: number) {
    if (num <= 0) {
        throw new Error("num must be above 0")
    }
    let count = 0;

    while (count < num) {
        yield {
            access_code: `${extra}${count + 1}`,
            deck_id: deckId,
            status: 'in-progress'
        }
        count += 1;
    }
}