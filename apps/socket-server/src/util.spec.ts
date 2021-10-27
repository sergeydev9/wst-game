import { calculateScore, buildScoreMap, scoreBoardFromMap } from './util';

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

describe('buildScoreMap', () => {

    it('should store two players that earned the same score under the same key', () => {
        const scores = [
            "player 1",
            "1000",
            "player 2",
            "1000"
        ];

        const actual = buildScoreMap(scores);
        expect(actual).toEqual('{"1000":["player 1","player 2"]}')
    });

    it('should store two players that earned different scores under different, correct keys', () => {
        const scores = [
            "player 1",
            "2000",
            "player 2",
            "1000"
        ];

        const actual = buildScoreMap(scores);
        expect(actual).toEqual('{"1000":["player 2"],"2000":["player 1"]}');
    })
})

describe('scoreBoardFromMap', () => {
    it('should return an array of objects with player name and rank', () => {
        const scores = [
            "player 1",
            "1000",
            "player 2",
            "1000"
        ];

        const [stringMap] = buildScoreMap(scores);
        const actual = scoreBoardFromMap(stringMap);

        expect(actual).toEqual([{ player_name: "player 1", rank: 1, score: 1000 }, { player_name: "player 2", rank: 1, score: 1000 }])

    })
})