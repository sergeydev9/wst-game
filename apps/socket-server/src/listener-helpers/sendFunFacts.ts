import { Socket } from "socket.io";
import { pubClient } from "../redis";
import { logger } from '@whosaidtrue/logger';
import { types, payloads } from '@whosaidtrue/api-interfaces';

/**
 * Fetch and send fun facts to connected clients
 */
const sendFunFacts = async (socket: Socket) => {
    const { groupVworld, bucketList } = socket.keys;

    const [bucketListResponse, groupVworldResponse] = await pubClient
        .pipeline()
        .hgetall(groupVworld)
        .hgetall(bucketList)
        .exec()

    socket.sendToAll(types.FUN_FACTS,
        {
            bucketList: bucketListResponse[1],
            groupVworld: groupVworldResponse[1]
        } as payloads.FunFacts);

    logger.debug({
        message: '[Send Fun Facts]',
        bucketList: bucketListResponse[1],
        groupVworld: groupVworldResponse[1]

    })
}

export default sendFunFacts;