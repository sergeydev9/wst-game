import { Socket } from 'socket.io';

// turn player object into string so it can be stored in redis set
export const playerValueString = (socket: Socket) => {
    return JSON.stringify({ id: socket.playerId, player_name: socket.playerName })
}