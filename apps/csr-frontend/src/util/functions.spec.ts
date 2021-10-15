import { buildScoreboardAndMap } from './functions';

describe('utils', () => {
    describe('buildScoreboardAndMap', () => {
        const scores = [
            "Test Name",
            "15000",
            "Test Name 2",
            "5000",
            "Test Name 3",
            "4000",
            "Test Name 4",
            "4000",
            "Test Name 5",
            "3000",
            "Test Name 6",
            "3000"
        ]
        const differences = {
            "Test Name": "1",
            "Test Name 2": "-1",
            "Test Name 3": "-1",
            "Test Name 4": "0",
            "Test Name 5": "-2",
            "Test Name 6": "-1"

        }
        it('should return a valid score map', () => {

            const [map] = buildScoreboardAndMap(scores, differences);

            const actual = map["Test Name"];
            expect(actual.name).toEqual("Test Name")
            expect(actual.rank).toEqual(1);
            expect(actual.points).toEqual(15000);
            expect(actual.rankDiff).toEqual(1);
        })

        it('should show 6 players', () => {
            const [, actual] = buildScoreboardAndMap(scores, differences);
            expect(actual.length).toEqual(6)
        })

        it('should show 8 players', () => {

            const testScores = [
                "Test Name",
                "15000",
                "Test Name 2",
                "5000",
                "Test Name 3",
                "4000",
                "Test Name 4",
                "4000",
                "Test Name 5",
                "4000",
                "Test Name 6",
                "4000",
                "Test Name 7",
                "4000",
                "Test Name 8",
                "4000"
            ]

            const testDifferences = {
                "Test Name": "1",
                "Test Name 2": "-1",
                "Test Name 3": "-1",
                "Test Name 4": "0",
                "Test Name 5": "-2",
                "Test Name 6": "-1",
                "Test Name 7": "1",
                "Test Name 8": "0"

            }
            const [, actual] = buildScoreboardAndMap(testScores, testDifferences);
            expect(actual.length).toEqual(8)
        })

        it('should show 7 players', () => {
            const testScores = [
                "Test Name",
                "15000",
                "Test Name 2",
                "5000",
                "Test Name 3",
                "4000",
                "Test Name 4",
                "4000",
                "Test Name 5",
                "4000",
                "Test Name 6",
                "4000",
                "Test Name 7",
                "4000",
                "Test Name 8",
                "3000"
            ]

            const testDifferences = {
                "Test Name": "1",
                "Test Name 2": "-1",
                "Test Name 3": "-1",
                "Test Name 4": "0",
                "Test Name 5": "-2",
                "Test Name 6": "-1",
                "Test Name 7": "1",
                "Test Name 8": "0"

            }
            const [, actual] = buildScoreboardAndMap(testScores, testDifferences);
            expect(actual.length).toEqual(7)
        })
    })
})