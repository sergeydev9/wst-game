import chooseNameReducer, { ChooseNameState, setCurrentOptions, setRemainingOptions } from './chooseNameSlice';

describe('chooseName reducer', () => {
    const initialState: ChooseNameState = {
        remainingOptions: [],
        currentOptions: [],
        rerolls: 0
    }
    it('has correct initial state', () => {
        expect(chooseNameReducer(undefined, { type: 'unknown' })).toEqual(initialState)
    });

    it('sets remainingOptions to value of payload', () => {
        const actual = chooseNameReducer(initialState, setRemainingOptions(['test1', 'test2', 'test3']));
        expect(actual.remainingOptions).toEqual(['test1', 'test2', 'test3'])
    })

    it('handles selectOption when there are no remaining options', () => {
        const actual = chooseNameReducer(initialState, setCurrentOptions())
        expect(actual).toEqual(initialState)
    })

    it('correctly sets rerolls', () => {
        const initial: ChooseNameState = {
            remainingOptions: ['test1', 'test2', 'test3', 'test3', 'test4', 'test5', 'test6'],
            currentOptions: [],
            rerolls: 0
        }
        const actual = chooseNameReducer(initial, setCurrentOptions());
        expect(actual.rerolls).toEqual(1);
        expect(actual.remainingOptions.length).toEqual(3);
        expect(actual.currentOptions.length).toEqual(3);
    })
})