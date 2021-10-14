import { calculateScore } from './util';

describe('calculateScore', () => {

    it('should match the value in the example', () => {

        const actual = calculateScore(5, 9, 7);
        expect(actual).toEqual(750);
    });

    it('should equal 0', () => {
        const actual = calculateScore(0, 9, 7);
        expect(actual).toEqual(0);
    })

    it('should equal 1500', () => {
        const actual = calculateScore(0, 2, 0);
        expect(actual).toEqual(1500);
    })
})