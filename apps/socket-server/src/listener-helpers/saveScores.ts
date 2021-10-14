import { logger } from '@whosaidtrue/logger';
import { payloads } from '@whosaidtrue/api-interfaces';
import { Keys } from '../keys';
import { pubClient } from '../redis';
import { answers } from "../db";
import { calculateScore } from '../util';

interface PlayerWithGuess {
    id: number;
    player_name: string;
    guess: number;
}

const saveScores = async (questionId: number, gameId: number) => {
    const haveAnswered = Keys.haveAnswered(questionId);
    const players = (await pubClient.smembers(haveAnswered)).map(p => JSON.parse(p)) as PlayerWithGuess[];
    const totalPlayers = Number(await pubClient.get(Keys.totalPlayers(questionId)));
    const totalTrue = Number(await pubClient.get(Keys.totalTrue(questionId)));

    // calculate and update data for each player that submitted a guess
    const promises = players.map(async player => {
        const score = calculateScore(player.guess, totalPlayers, totalTrue) // calculate
        const answerIdSpace = Keys.answerIdsForPlayer(player.id);
        const answerId = await pubClient.get(`${answerIdSpace}:${questionId}`) // player's answerId

        logger.debug({
            score,
            player,
            answerId,
            answerIdSpace,
            totalPlayers,
            totalTrue
        })
        await answers.setScore(Number(answerId), score); // save score in DB

        const oldRank = await pubClient.zrevrank(`games:${gameId}:scoreboard`, player.player_name)

        // save score for question, increment total score, return old and new ranks
        const [, , rankRes] = await pubClient
            .pipeline()
            .hset(`gameQuestions:${questionId}:pointsByPlayer`, player.player_name, score)
            .zincrby(`games:${gameId}:scoreboard`, score, player.player_name)
            .zrevrank(`games:${gameId}:scoreboard`, player.player_name)
            .exec();

        const newRank = rankRes[1];

        // save rank dif
        const rankDif = oldRank - newRank;

        logger.debug({
            newRank,
            oldRank,
            rankDif
        })
        return pubClient.hset(`gameQuestions:${questionId}:rankDifferences`, player.player_name, rankDif);

    })

    // wait until updates are done for all players
    await Promise.all(promises);

    const [r1, r2, r3, r4, r5] = await pubClient
        .pipeline()
        .zrevrange(`games:${gameId}:scoreboard`, 0, -1, 'WITHSCORES')
        .hgetall(`gameQuestions:${questionId}:rankDifferences`)
        .hgetall(`gameQuestions:${questionId}:pointsByPlayer`)
        .get(Keys.totalTrue(questionId))
        .scard(Keys.haveAnswered(questionId))
        .exec()

    // scores come in an ordered array, with the first element having the highest
    // score.
    const scores = r1[1];
    const rankDifferences = r2[1];
    const pointsEarned = r3[1];

    // percent true for group
    let groupTrueNum = r4[1];

    if (groupTrueNum === null) {
        groupTrueNum = 0;
    }
    const groupTotal = r5[1];
    const groupTrue = (groupTrueNum / groupTotal) * 100;

    return {
        rankDifferences,
        scores,
        pointsEarned,
        groupTrue, // percentage of players that answered 'true'
        correctAnswer: groupTrueNum, // number of players that answered 'true'
    } as payloads.QuestionEnd

}

export default saveScores;