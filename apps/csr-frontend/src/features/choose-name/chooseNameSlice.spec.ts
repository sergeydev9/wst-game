import { chooseNameReducer, ChooseNameState, setCurrentNameOptions, setRemainingNameOptions } from './chooseNameSlice';

describe('chooseName reducer', () => {
    const initialState: ChooseNameState = {
        remainingNameOptions: [],
        currentNameOptions: [],
        rerolls: 0
    }
    it('has correct initial state', () => {
        expect(chooseNameReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    });

    it('sets remainingNameOptions to value of payload', () => {
        const actual = chooseNameReducer(initialState, setRemainingNameOptions(['test1', 'test2', 'test3']));
        expect(actual.remainingNameOptions).toEqual(['test1', 'test2', 'test3'])
    })

    it('handles selectOption when there are no remaining options', () => {
        const actual = chooseNameReducer(initialState, setCurrentNameOptions())
        expect(actual).toEqual(initialState)
    })

    it('correctly sets rerolls', () => {
        const initial: ChooseNameState = {
            remainingNameOptions: [{ name: 'test1', id: 1, clean: true }, { name: 'test2', id: 2, clean: true }, { name: 'test3', id: 3, clean: true }, { name: 'test3', id: 3, clean: true }, { name: 'test4', id: 4, clean: true }, { name: 'test5', id: 5, clean: true }, { name: 'test6', id: 6, clean: true }],
            currentNameOptions: [],
            rerolls: 0
        }
        const actual = chooseNameReducer(initial, setCurrentNameOptions());
        expect(actual.rerolls).toEqual(1);
        expect(actual.remainingNameOptions.length).toEqual(3);
        expect(actual.currentNameOptions.length).toEqual(3);
    })
})