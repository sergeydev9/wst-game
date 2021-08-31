import { testDecks } from '@whosaidtrue/data';
import { Deck, MovieRating } from '@whosaidtrue/app-interfaces';
import deckSelectionReducer, { initialState, DeckSelectionState, selectOwned } from "./deckSlice";
import { store } from '../../app/store';


describe('deckSelectionSlice', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should have expected intial state', () => {
        expect(deckSelectionReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    })

    describe('selectOwned', () => {
        const decks: Deck[] = [];

        beforeAll(() => {
            let count = 1;
            for (const deck of testDecks(20)) {
                decks.push({ id: count, ...deck })
                count++
            }
        })
        it('should return all owned decks', () => {

            const state: DeckSelectionState = {
                ...initialState,
                owned: decks.slice(0, 10),
                notOwned: decks.slice(10),
            }

            const rootState = store.getState();
            rootState.deckSelection = state;
            expect(selectOwned(rootState).length).toEqual(10)
        })

        it('should filter out non sfw decks', () => {

            const notSfw = decks.slice(0, 5).map(deck => {
                return { ...deck, sfw: false }
            })
            const state: DeckSelectionState = {
                ...initialState,
                sfwOnly: true,
                owned: [...notSfw, ...decks.slice(5, 10)],
                notOwned: decks.slice(10),
            }

            const rootState = store.getState();
            rootState.deckSelection = state;
            expect(selectOwned(rootState).length).toEqual(5)
        })

        it('should only return R rated owned decks', () => {
            const rRated = decks.slice(0, 1).map(deck => {
                return { ...deck, movie_rating: 'R' as MovieRating }
            })
            const state: DeckSelectionState = {
                ...initialState,
                movieRatingFilters: ["R"],
                owned: [...rRated, ...decks.slice(1, 10)],
                notOwned: decks.slice(10),
            }

            const rootState = store.getState();
            rootState.deckSelection = state;
            expect(selectOwned(rootState).length).toEqual(1)
        })

        it('should only return SFW R rated owned decks', () => {
            const rRated = decks.slice(0, 2).map((deck, i) => {
                if (i > 0) {
                    return { ...deck, movie_rating: 'R' as MovieRating }
                } else {
                    return { ...deck, sfw: false, movie_rating: 'R' as MovieRating }
                }

            })
            const state: DeckSelectionState = {
                ...initialState,
                sfwOnly: true,
                movieRatingFilters: ["R"],
                owned: [...rRated, ...decks.slice(1, 10)],
                notOwned: decks.slice(10),
            }

            const rootState = store.getState();
            rootState.deckSelection = state;
            expect(selectOwned(rootState).length).toEqual(1)
        })
    })

})