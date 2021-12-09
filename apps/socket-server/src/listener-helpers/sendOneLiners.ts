import { Socket } from 'socket.io';
import { pubClient } from '../redis';
import { types } from '@whosaidtrue/api-interfaces';
import Keys from '../keys';

/**
 * Fetch and send oneliners connected clients
 */
const sendOneLiners = async (socket: Socket) => {
  const { gameId } = socket;

  const oneLiners = await pubClient.get(Keys.oneLiners(gameId));

  socket.emit(types.ONE_LINERS, JSON.parse(oneLiners));
};

export default sendOneLiners;
