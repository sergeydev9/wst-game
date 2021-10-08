import { Socket } from 'socket.io';

// return the game key for a socket connection
export const getGameKey = (socket: Socket) => {
    return `games:${socket.gameId}`
}

// each game has a set of current players. This function
// retrieves the key for the set that socket belongs to
export const getCurrentPlayersKey = (socket: Socket) => {
    const gameKey = getGameKey(socket);
    return `${gameKey}:currentPlayers`;
}

export const playerValueString = (socket: Socket) => {
    return JSON.stringify({ id: socket.playerId, player_name: socket.playerName })
}