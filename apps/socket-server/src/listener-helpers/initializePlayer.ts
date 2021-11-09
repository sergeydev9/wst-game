import { Socket } from "socket.io";
import { pubClient } from "../redis";
import { playerValueString } from "../util";
import { ONE_DAY } from '../constants';
import sendPlayerList from './sendPlayerList';

const initializePlayer = async (socket: Socket) => {
    const playersKey = socket.keys.currentPlayers;

    // add player to redis
    await pubClient
        .pipeline()
        .sadd(playersKey, playerValueString(socket))
        .expire(playersKey, ONE_DAY)
        .exec()

    // send list of current players back to connecting client
    sendPlayerList(socket);
}

export default initializePlayer;