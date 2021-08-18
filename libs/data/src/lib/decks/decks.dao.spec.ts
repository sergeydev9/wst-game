import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import { testDecks, testQuestions } from '../util/testEntityGenerators';
import Decks from './Decks.dao';
import Users from '../users/Users.dao';
import Questions from '../questions/Questions.dao';
import TEST_DECKS from '../test-objects/decks';


describe('Decks', () => {
    let pool: Pool;
    let decks: Decks;
    let users: Users;
    let questions: Questions;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);
        decks = new Decks(pool);
        users = new Users(pool);
        questions = new Questions(pool);
        await cleanDb(pool);
    })

    afterAll(async () => {
        pool.end()
    })

    it("should return an empty array if user doesn't own any decks", async () => {
        const { rows } = await users.register({ email: 'test_decks@test.com', password: 'password', roles: ['user'] });
        const userId = rows[0].id;

        const actual = await decks.getUserDecks(userId);
        expect(actual.rows.length).toEqual(0)
    })

    describe('getQuestions', () => {
        const deckIds: number[] = [];

        beforeAll(async () => {
            await cleanDb(pool);
            // create 2 decks and push ids to array
            for (const deck of testDecks(2, 'decks - getQuestion')) {
                const { rows } = await decks.insertOne({ ...deck })
                deckIds.push(rows[0].id)
            }

            let count = 0;
            // create questions and assign them to deck
            // 5 have status active, 2 are marked inactive.
            // Function should only return the 5 active questions.
            for (const question of testQuestions(7, deckIds[0])) {
                const status = count > 4 ? 'inactive' : 'active';
                await questions.insertOne({ ...question, status })
                count++;
            }

        })

        it('should return all active questions associated with the deck', async () => {
            const { rows } = await decks.getQuestions(deckIds[0]);
            expect(rows.length).toEqual(5)
        })

        it('should not return questions associated to another deck', async () => {
            // add 3 new questions associated to second deck
            for (const question of testQuestions(3, deckIds[1])) {
                await questions.insertOne({ ...question })
            }

            const { rows } = await decks.getQuestions(deckIds[0]);
            expect(rows.length).toEqual(5)
        })
    })

    describe('lessThanAgeRating and getByMovieRating', () => {

        beforeEach(async () => {
            await cleanDb(pool);
            // Save decks. First deck has age rating 12 and movie rating "PG-13".
            // All other decks have age rating 17 and movie rating "R"
            // Keep this the only test that sets an age rating below 13 to prevent false
            // fails when tests overlap
            const results = TEST_DECKS.map((deck, i) => {
                const {
                    name,
                    sort_order,
                    sfw,
                    purchase_price,
                    status,
                    description,
                    clean
                } = deck;
                const query = {
                    text: `INSERT INTO decks (name, sort_order, sfw, age_rating, movie_rating, purchase_price, status, description, clean ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                    values: [name, sort_order, sfw, i > 0 ? 17 : 12, i > 0 ? "R" : "PG-13", purchase_price, status, description, clean]
                }
                return pool.query(query)
            });

            // resolve all the queries
            await Promise.all(results);
        });

        it('should return only the deck with age rating below 16', async () => {
            const { rows } = await decks.lessThanAgeRating(13);
            expect(rows.length).toEqual(1);
        })

        it('should return only the deck with PG-13 rating', async () => {
            const { rows } = await decks.getByMovieRating("PG-13");
            expect(rows.length).toEqual(1)
        })
    })



    describe('getUserDecks and getNotOwned', () => {
        let userId: number;

        beforeEach(async () => {
            await cleanDb(pool);
            // Save a user and get their id before each test
            const { rows } = await users.register({ email: 'test_decks@test.com', password: 'password', roles: ['user'] });
            userId = rows[0].id;

            // insert 5 test decks into DB before each test
            const results = TEST_DECKS.map(deck => {
                const {
                    name,
                    sort_order,
                    sfw,
                    age_rating,
                    movie_rating,
                    purchase_price,
                    status,
                    description,
                    clean
                } = deck;
                const query = {
                    text: `INSERT INTO decks (name, sort_order, sfw, age_rating, movie_rating, purchase_price, status, description, clean ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
                    values: [name, sort_order, sfw, age_rating, movie_rating, purchase_price, status, description, clean]
                }
                return pool.query(query)
            });

            // resolve all the queries and push results into array
            const resolved = await Promise.all(results);
            const deckIds = [];
            resolved.forEach(res => deckIds.push(res.rows[0].id))

            // create a user_deck record for the first 3 decks that were saved.
            // this simulates the user owning the decks.
            const idSlice = deckIds.slice(0, 3);
            const userDeckPromises = idSlice.map(id => {
                const query = {
                    text: 'INSERT INTO user_decks (deck_id, user_id) VALUES ($1, $2)',
                    values: [id, userId]
                }
                return pool.query(query)
            })
            await Promise.all(userDeckPromises)
        })

        it('should retrieve the 3 decks owned by the user', async () => {
            const { rows } = await decks.getUserDecks(userId);
            expect(rows.length).toEqual(3)
        })

        it('should retrieve the 2 decks NOT owned by the user', async () => {
            const { rows } = await decks.getNotOwned(userId);
            expect(rows.length).toEqual(2)
        })
    })
})