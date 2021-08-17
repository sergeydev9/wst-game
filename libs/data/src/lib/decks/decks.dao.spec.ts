import { Pool } from 'pg';
import { TEST_DB_CONNECTION } from '@whosaidtrue/util';
import Decks from './decks.dao';
import Users from '../users/users.dao';
import TEST_DECKS from '../test-objects/decks';


describe('Decks dao', () => {
    let pool: Pool;
    let decks: Decks;
    let users: Users;

    beforeAll(async () => {
        pool = new Pool(TEST_DB_CONNECTION);

        decks = new Decks(pool);
        users = new Users(pool);
    })

    beforeEach(async () => {
        // clean DB
        await pool.query(`DELETE FROM decks WHERE id > 0`);
        await pool.query(`DELETE FROM users WHERE id > 0`);
        await pool.query(`DELETE FROM user_decks WHERE id > 0`);
    })

    afterAll(async () => {
        pool.end()
    })

    describe('rating filters', () => {

        beforeEach(async () => {
            // Save decks. First deck has age rating 13 and movie rating "PG-13".
            // All other decks have age rating 17 and movie rating "R"
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
                    values: [name, sort_order, sfw, i > 0 ? 17 : 13, i > 0 ? "R" : "PG-13", purchase_price, status, description, clean]
                }
                return pool.query(query)
            });

            // resolve all the queries
            await Promise.all(results);
        });

        it('should return only the deck with age rating below 16', async () => {
            const { rows } = await decks.lessThanAgeRating(17);
            expect(rows.length).toEqual(1);
        })

        it('should return only the deck with PG-13 rating', async () => {
            const { rows } = await decks.getByMovieRating("PG-13");
            expect(rows.length).toEqual(1)
        })
    })



    describe('with owned and unowned decks', () => {
        let userId: number;

        beforeEach(async () => {
            // Save a user and get their id before each test
            const { rows } = await users.insertOne({ email: 'test_decks@test.com', password: 'password', roles: ['user'] });
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
            // this simulates the user owning the deck.
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

    it("should return an empty array if user doesn't own any decks", async () => {
        const { rows } = await users.insertOne({ email: 'test_decks@test.com', password: 'password', roles: ['user'] });
        const userId = rows[0].id;

        const actual = await decks.getUserDecks(userId);
        expect(actual.rows.length).toEqual(0)
    })

})