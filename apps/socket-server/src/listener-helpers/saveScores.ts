import { payloads } from '@whosaidtrue/api-interfaces';
import { Keys } from '../keys';
import { pubClient } from '../redis';
import { answers } from "../db";
import { calculateScore, buildScoreMap, scoreBoardFromMap } from '../util';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { ONE_DAY } from '../constants';
import { logger } from '@whosaidtrue/logger';

interface PlayerWithGuess extends PlayerRef {
    guess: number;
}

const saveScores = async (questionId: number, gameId: number) => {
    const haveAnswered = Keys.haveAnswered(questionId);
    const haveNotAnswered = Keys.haveNotAnswered(questionId);
    const haveAnsweredPlayers = (await pubClient.smembers(haveAnswered)).map(p => JSON.parse(p)) as PlayerWithGuess[];
    const haveNotAnsweredPlayers = (await pubClient.smembers(haveNotAnswered)).map(p => JSON.parse(p)) as PlayerRef[];
    const totalPlayers = Number(await pubClient.get(Keys.totalPlayers(questionId)));
    const totalTrue = Number(await pubClient.get(Keys.totalTrue(questionId)));

    // updates for players that have answered
    const haveAnsweredPromises = updatePlayersThatHaveAnswered(haveAnsweredPlayers, gameId, questionId, totalPlayers, totalTrue);

    // updates for players that haven't answered
    const haveNotAnsweredPromises = updateHaventAnswered(haveNotAnsweredPlayers, gameId, questionId);

    // wait until updates are done for all players
    await Promise.all([haveNotAnsweredPromises, haveAnsweredPromises]);


    const [r1, r2, r3] = await pubClient
        .pipeline()
        .zrevrange(`games:${gameId}:rankedlist`, 0, -1, 'WITHSCORES')
        .hgetall(`gameQuestions:${questionId}:pointsByPlayer`)
        .get(Keys.totalTrue(questionId))
        .exec()

    // scores come in an ordered array, with the first element having the highest
    // score.
    const scores = r1[1];
    const pointsEarned = r2[1];

    // percent true for group
    let groupTrueNum = r3[1];

    if (groupTrueNum === null) {
        groupTrueNum = 0;
    }
    const groupTrue = (groupTrueNum / totalPlayers) * 100;

    // build score map object
    const [map, stringifiedMap] = buildScoreMap(scores);

    logger.debug({
        message: 'score map',
        map,
        stringifiedMap,
        scores,
        pointsEarned
    })

    // build scoreboard array
    const scoreboard = scoreBoardFromMap(map);

    // save new rank for each player, and calculate rank change
    for (const score of scoreboard) {
        const { player_name, rank } = score;

        const playerKey = `games:${gameId}:playerRanks:${player_name}`;

        const [oldRank] = await pubClient
            .pipeline()
            .getset(playerKey, rank)
            .expire(playerKey, ONE_DAY)
            .exec()

        score.rankDifference = oldRank[1] ? oldRank[1] - rank : 0;
    }

    // save latest scoreboard in redis
    await pubClient.set(`games:${gameId}:latestResults`, stringifiedMap);

    return {
        scores: scoreboard,
        pointsEarned,
        groupTrue, // percentage of players that answered 'true'
        correctAnswer: groupTrueNum, // number of players that answered 'true'
    } as payloads.QuestionEnd

}

/**
 * Perform the necessary updates in the DB and in Redis for
 * players that did submit an answer
 *
 * @returns an array of promises that perform updates for each player
 */
async function updatePlayersThatHaveAnswered(
    players: PlayerWithGuess[],
    gameId: number,
    questionId: number,
    totalPlayers: number,
    totalTrue: number
) {
    const haveAnsweredPromises = players.map(async player => {

        // calculate player score
        const score = calculateScore(player.guess, totalPlayers, totalTrue);

        // get player's answer ID
        const answerIdSpace = Keys.answerIdsForPlayer(player.id);
        const answerId = await pubClient.get(`${answerIdSpace}:${questionId}`) // player's answerId

        // save score in DB
        await answers.setScore(Number(answerId), score);

        // add score to the ranked set
        return pubClient
            .pipeline()
            .hset(`gameQuestions:${questionId}:pointsByPlayer`, player.player_name, score) // for points earned
            .zincrby(`games:${gameId}:rankedlist`, score, player.player_name)
            .exec();

    })

    return await Promise.all(haveAnsweredPromises);
}

/**
 * Perform the necessary updates in Redis for
 * players that did NOT submit an answer
 *
 * @returns an array of promises that perform updates for each player
 */
async function updateHaventAnswered(players: PlayerRef[], gameId: number, questionId: number) {
    const haveNotAnsweredPromises = players.map(async player => {

        // set players that haven't answered as having earned 0 points
        await pubClient
            .pipeline()
            .hset(`gameQuestions:${questionId}:pointsByPlayer`, player.player_name, 0)
            .zincrby(`games:${gameId}:rankedlist`, 0, player.player_name)
            .exec();

    })
    return await Promise.all(haveNotAnsweredPromises);
}

export default saveScores;