import { Socket } from 'socket.io';

// turn player object into string so it can be stored in redis set
export function playerValueString(socket: Socket, guess?: number) {

    let val: Record<string, string | number>;
    const player = { id: socket.playerId, player_name: socket.playerName }

    if (guess) {
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