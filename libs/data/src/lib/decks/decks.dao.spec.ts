import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '../util/testDbConnection';
import { cleanDb } from '../util/cleanDb';
import { testDecks, testQuestions } from '../util/testEntityGenerators';
import { setupUserDecks, setupDecks } from '../util/testDependencySetup';
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
        const { rows } = await users.register('test_decks@test.com', 'password');
        const userId = rows[0].id;

        const actual = await decks.getUserDecks(userId);
        expect(actual.rows.length).toEqual(0)
    })

    describe('getDetails', () => {
        let deckId: number;

        beforeEach(async () => {
            await cleanDb(pool);
            // create 2 decks and push ids to array
            for (const deck of testDecks(1)) {
                const { rows } = await decks.insertOne({ ...deck })
                deckId = rows[0].id
            }
        })

        it('should return the expected columns', async () => {

            // get the details
            const { rows } = await decks.getDetails(deckId)
            const {
                id,
                name,
                sort_order,
                clean,
                age_rating,
                movie_rating,
                sfw,
                status,
                description,
                purchase_price,
                example_question,
                thumbnail_url
            } = rows[0];

            // check response for each attribute
            expect(id).toBeDefined()
            expect(name).toBeDefined()
            expect(sort_order).toBeDefined()
            expect(clean).toBeDefined()
            expect(age_rating).toBeDefined()
            expect(movie_rating).toBeDefined()
            expect(sfw).toBeDefined()
            expect(status).toBeDefined()
            expect(description).toBeDefined()
            expect(purchase_price).toBeDefined()
            expect(example_question).toBeDefined()
            expect(thumbnail_url).toBeDefined()
        })
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
            // save a user and 5 decks.
            // user owns 3 out of the 5 decks.
            const setup = await setupUserDecks(pool, 5, 3)
            userId = setup.userId
        })

        it('should retrieve the 3 decks owned by the user', async () => {
            const { rows } = await decks.getUserDecks(userId);
            expect(rows.length).toEqual(3)
        })

        it('should retrieve the 2 decks NOT owned by the user', async () => {
            const { rows } = await decks.getNotOwned(userId);
            expect(rows.length).toEqual(2)
        })


        it('should include any free decks', async () => {
            for (const deck of testDecks(1, 'random')) {
                deck.purchase_price = '0.00'
                await decks.insertOne({ ...deck })
            }

            const { rows } = await decks.getUserDecks(userId);
            expect(rows.length).toEqual(4)
        })
    })

    describe('deckSelection', () => {

        beforeEach(async () => {
            await cleanDb(pool);
        })

        it('should return the expected number of decks', async () => {
            await setupDecks(pool, 50)
            const { rows } = await decks.guestDeckSelection({ pageNumber: 0, pageSize: 30 })
            expect(rows.length).toEqual(30)
        })

        // TODO add test for age filter
    })

    describe('userDeckSelection', () => {

        beforeEach(async () => {
            await cleanDb(pool);
        })

        it('should return 25 decks (page size larger than remaining unowned decs)', async () => {
            // save a user and 50 decks
            // user owns 25 decks
            // 10 decks have age rating 21, the rest 13
            const setup = await setupUserDecks(pool, 50, 25);
            const userId = setup.userId;
            const { rows } = await decks.userDeckSelection({ userId, pageNumber: 0, pageSize: 30 });
            expect(rows.length).toEqual(25)

        })

        it('should return different set of decks when page number is increased', async () => {
            const setup = await setupUserDecks(pool, 90, 10);
            const userId = setup.userId;
            const firstResult = await decks.userDeckSelection({ userId: userId, pageNumber: 0, pageSize: 30 });
            const secondResult = await decks.userDeckSelection({ userId: userId, pageNumber: 1, pageSize: 30 });

            // make array of ids from first query
            const firstIds = []
            firstResult.rows.map(row => firstIds.push(row.id))

            // make array of ids from second query
            const secondIds = [];
            secondResult.rows.map(row => secondIds.push(row.id))

            // no ids in common
            expect(firstIds.every(v => !secondIds.some(y => y === v))).toEqual(true)
        })

        it('should return empty array if offset exceeds number of rows', async () => {
            const setup = await setupUserDecks(pool, 50, 10);
            const userId = setup.userId;

            // offset = 120, only 40 valid rows
            const { rows } = await decks.userDeckSelection({ userId, pageNumber: 4, pageSize: 30 });
            expect(rows.length).toEqual(0)
        })


        // TODO add test for age filter

    })
})