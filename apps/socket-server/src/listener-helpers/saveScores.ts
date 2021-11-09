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

/**
 * Calculate and save scores for all players at the end of a question.
 */
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

    // save latest scoreboard in redis, and get the global true % so it can be compared
    const [, bucketList, groupVworld, questionStr] = await pubClient
        .pipeline()
        .set(`games:${gameId}:latestResults`, stringifiedMap, 'EX', ONE_DAY)
        .hget(`games:${gameId}:bucketList`, 'difference')
        .hget(`games:${gameId}:groupVworld`, 'difference')
        .get(`games:${gameId}:currentQuestion`)
        .exec()

    const question = JSON.parse(questionStr[1]); // current question
    const currentQuestionDifference = question.globalTrue - groupTrue;

    logger.debug({
        message: 'Fetching differences for fun facts',
        question,
        groupVworld: groupVworld[1],
        bucketList: bucketList[1],
        groupTrue,
        currentQuestionDifference
    })

    // if there is a bucket list, calculate difference and change bucket list if appropriate
    if (!bucketList[1] || Number(bucketList[1]) > Number(currentQuestionDifference)) {

        await pubClient
            .pipeline()
            .hset(
                `games:${gameId}:bucketList`,
                "difference", `${currentQuestionDifference}`,
                "textForGuess", question.textForGuess,
                "globalTrue", question.globalTrue,
                "groupTrue", groupTrue)
            .expire(`games:${gameId}:bucketList`, ONE_DAY)
            .exec()
    }

    if (!groupVworld[1] || Number(groupVworld[1]) < currentQuestionDifference) {
        await pubClient
            .pipeline()
            .hset(
                `games:${gameId}:groupVworld`,
                "difference", `${currentQuestionDifference}`,
                "textForGuess", question.textForGuess,
                "globalTrue", question.globalTrue,
                "groupTrue", groupTrue)
            .expire(`games:${gameId}:groupVworld`, ONE_DAY)
            .exec()
    }

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
            .expire(`gameQuestions:${questionId}:pointsByPlayer`, ONE_DAY)
            .zincrby(`games:${gameId}:rankedlist`, score, player.player_name)
            .expire(`games:${gameId}:rankedlist`, ONE_DAY)
            .exec();

    })

    await countSimilar(gameId, questionId);

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
            .expire(`gameQuestions:${questionId}:pointsByPlayer`, ONE_DAY)
            .zincrby(`games:${gameId}:rankedlist`, 0, player.player_name)
            .expire(`games:${gameId}:rankedlist`, ONE_DAY)
            .exec();

    })
    return await Promise.all(haveNotAnsweredPromises);
}

/**
 * Each player has a similarity counter for each other player in the game.
 *
 * e.g. player1Counter = {
 *      player2: 3,
 *      player3: 2,
 * }
 *
 * The keys in the hash are the player names, the values are the number of questions
 * where those other players gave the same answer.
 *
 * Each game also has a key that stores the maximum similarity among its players.
 *
 * This function updates the counter for each player, as well as the maximum
 * for the game if apprppriate.
 *
 * @returns an array of promises for the updates.
 */
async function countSimilar(gameId: number, questionId: number) {
    const mostSimilar = await pubClient.hgetall(`games:${gameId}:mostSimilar`)

    // increment counter for those that answered true
    const answeredTrue = await pubClient.smembers(`gameQuestions:${questionId}:true`);

    const truePromises = answeredTrue.map(name => {

        const inner = answeredTrue.map(async innerName => {
            if (innerName !== name) {
                const [r] = await pubClient
                    .pipeline()
                    .zincrby(`games:${gameId}:similaritySets:${name}`, 1, innerName)
                    .expire(`games:${gameId}:similaritySets:${name}`, ONE_DAY)
                    .exec()

                const incrResult = r[1];


                logger.debug({
                    message: '[Save Scores] Incrementing similarity for players that answered true',
                    mostSimilar,
                    incrResult
                })

                if (incrResult && mostSimilar && mostSimilar.numSameAnswer) {

                    if (mostSimilar.numSameAnswer && Number(incrResult) > Number(mostSimilar.numSameAnswer)) {

                        return pubClient
                            .pipeline()
                            .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                            .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                            .exec()
                    }

                } else if (incrResult) {
                    return pubClient
                        .pipeline()
                        .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                        .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                        .exec()
                }
            }
        })
        return Promise.all(inner)

    })

    // increment counter for those that answered false
    const answeredFalse = await pubClient.smembers(`gameQuestions:${questionId}:false`);

    const falsePromises = answeredFalse.map(name => {

        const inner = answeredFalse.map(async innerName => {
            if (innerName !== name) {

                const [r] = await pubClient
                    .pipeline()
                    .zincrby(`games:${gameId}:similaritySets:${name}`, 1, innerName)
                    .expire(`games:${gameId}:similaritySets:${name}`, ONE_DAY)
                    .exec()

                const incrResult = r[1];


                logger.debug({
                    message: '[Save Scores] Incrementing similarity for players that answered false',
                    mostSimilar,
                    incrResult
                })

                if (incrResult && mostSimilar && mostSimilar.numSameAnswer) {

                    if (mostSimilar.numSameAnswer && Number(incrResult) > Number(mostSimilar.numSameAnswer)) {
                        return pubClient
                            .pipeline()
                            .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                            .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                            .exec()
                    }

                } else if (incrResult) {
                    return pubClient
                        .pipeline()
                        .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                        .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                        .exec()
                }
            }
        })

        return Promise.all(inner)
    })

    // increment counter for those that passed
    const passed = await pubClient.smembers(`gameQuestions:${questionId}:pass`);

    const passedPromises = passed.map(name => {

        const inner = passed.map(async innerName => {
            if (innerName !== name) {
                const [r] = await pubClient
                    .pipeline()
                    .zincrby(`games:${gameId}:similaritySets:${name}`, 1, innerName)
                    .expire(`games:${gameId}:similaritySets:${name}`, ONE_DAY)
                    .exec()

                const incrResult = r[1];

                logger.debug({
                    message: '[Save Scores] Incrementing similarity for players that passed',
                    mostSimilar,
                    incrResult
                })

                if (incrResult && mostSimilar && mostSimilar.numSameAnswer) {

                    if (mostSimilar.numSameAnswer && Number(incrResult) > Number(mostSimilar.numSameAnswer)) {
                        return pubClient
                            .pipeline()
                            .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                            .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                            .exec()
                    }

                } else if (incrResult) {
                    return pubClient
                        .pipeline()
                        .hset(`games:${gameId}:mostSimilar`, 'numSameAnswer', incrResult, "players", `${name} & ${innerName}`)
                        .expire(`games:${gameId}:mostSimilar`, ONE_DAY)
                }
            }
        })

        return Promise.all(inner)
    })

    logger.debug({
        message: '[Save Scores] calculating similarity',
        answeredTrue,
        answeredFalse,
        passed
    })

    await Promise.all(truePromises);
    await Promise.all(falsePromises);
    await Promise.all(passedPromises);


}

export default saveScores;