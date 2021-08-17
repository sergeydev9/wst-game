import { testNames } from './testEntityGenerators';

describe('testNames', () => {

    it('should return the right number of names', () => {
        const actual = [...testNames(5, 'extra')];
        expect(actual.length).toEqual(5);
    })

    it('should return correctly formatted names', () => {
        const actual = [...testNames(1, 'extra')];
        expect(actual[0]).toEqual("Player Name 1 extra");
    })

    it('should throw if input is 0 or less', () => {
        expect(() => [...testNames(0, 'extra')]).toThrow();
        expect(() => [...testNames(-1, 'extra')]).toThrow();

    })
})