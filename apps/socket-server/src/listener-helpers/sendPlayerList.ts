import { types, payloads } from '@whosaidtrue/api-interfaces';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import { Socket } from 'socket.io';
import { logger } from '@whosaidtrue/logger';
import { pubClient } from '../redis';

// Sends current players list to the socket
const sendPlayerList = async (socket: Socket) => {
  const playersResponse = await pubClient.smembers(socket.keys.currentPlayers);
  const players = playersResponse.map((player) =>
    JSON.parse(player)
  ) as PlayerRef[]; // players are stored as a string
  logger.debug(`Player list: ${playersResponse}`);

  socket.sendToAll(types.SET_CURRENT_PLAYERS, {
    players,
  } as payloads.SetCurrentPlayers);

  // send players to client
};

export default sendPlayerList;
