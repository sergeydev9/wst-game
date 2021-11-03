import { ScoreboardEntry } from '@whosaidtrue/app-interfaces';
import { Socket } from 'socket.io';

// turn player object into string so it can be stored in redis set
export function playerValueString(socket: Socket, guess?: number) {

    let val: Record<string, string | number>;
    const player = { id: socket.playerId, player_name: socket.playerName }

    if (typeof guess === 'number') {
        val = { ...player, guess };
    } else {
        val = player;
    }
    return JSON.stringify(val)
}

export function calculateScore(playerGuess: number, numPlayers: number, totalTrue: number) {
    const MAX_POINTS = 1500;           // The maximum number of points earned for one question
    const STEP = 50;                   // scores must be evenly divisible by this number. Round up to nearest
    const SCALAR = 0.6                 // Narrows the range of possible scores. For example, if the correct answer was 4, but a player guessed 2, the lower this scalar is, the higher that player's score would be

    const guessRounded = Math.floor((playerGuess / numPlayers) * 100);
    const guessRoundedAgain = Math.floor(guessRounded / 10) * 10; // makes value evenly divisible by 10
    const answerRounded = Math.floor((totalTrue / numPlayers) * 10) * 10;
    const difference = Math.abs(guessRoundedAgain - answerRounded);
    const left = difference / (100 / (numPlayers + 1));
    const right = 1 / (numPlayers - Math.round(SCALAR * numPlayers));
    const beforeRounding = MAX_POINTS - MAX_POINTS * left * right;
    const points = beforeRounding - (beforeRounding % STEP); // make divisible by 50

    return points >= 0 ? points : 0;
}

/**
 * JSON stringified object with scores as the keys,
 * and player name arrays as the values
 */
export function buildScoreMap(scores: string[]): [Record<string, string[]>, string] {
    const map = {};

    scores.forEach((str, index) => {

        // odd indices are scores
        if (index % 2 === 0) {

            // add each name to an array, stored at the key of their score
            const score = scores[index + 1];
            if (score) {
                const playerNameArray = map[score]
                playerNameArray ? map[score] = [...playerNameArray, str] : map[score] = [str];
            }
        }
    })

    return [map, JSON.stringify(map)];
}

/**
 * score map (object with score as keys, and player name array as values) to generate
 * a scoreboard array e.g. [ {player_name: "Some Name", rank: 1, score: 1000}]
 *
 */
export function scoreBoardFromMap(scoreMap: Record<string, string[]>): ScoreboardEntry[] {
    const result = [];

    const sortedKeys = Object.keys(scoreMap).sort().reverse();

    sortedKeys.forEach((key, index) => {
        const names = scoreMap[key];

        names.forEach((name: string) => {
            result.push({ player_name: name, rank: index + 1, score: Number(key) });
        })
    })

    return result;
}
