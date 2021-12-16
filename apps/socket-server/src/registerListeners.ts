import { Server, Socket } from 'socket.io';
import { types, payloads } from '@whosaidtrue/api-interfaces';
import { PlayerRef } from '@whosaidtrue/app-interfaces';
import {
  logger,
  logIncoming,
  logOutgoing,
  logError,
} from '@whosaidtrue/logger';
import { playerValueString } from './util';
import { games, gamePlayers } from './db';
import { pubClient } from './redis';
import { ONE_DAY } from './constants';
import startGame from './listener-helpers/startGame';
import submitAnswerPart1 from './listener-helpers/submitAnswerPart1';
import submitAnswerPart2 from './listener-helpers/submitAnswerPart2';
import saveScores from './listener-helpers/saveScores';
import nextQuestion from './listener-helpers/nextQuestion';
import playerLeft from './listener-helpers/playerLeft';
import endGame from './listener-helpers/endGame';
import sendFunFacts from './listener-helpers/sendFunFacts';
import removePlayer from './listener-helpers/removePlayer';
import Keys from './keys';
import sendPlayerList from './listener-helpers/sendPlayerList';
import sendOneLiners from './listener-helpers/sendOneLiners';

const handleDisconnect = async (socket: Socket, reason: string) => {
  const {
    currentPlayers,
    currentQuestionId,
    currentSequenceIndex,
    gameStatus,
  } = socket.keys;

  const isPlayerRecentlyDisconnected = await pubClient.get(
    Keys.recentlyDisconnected(socket.gameId, socket.playerId)
  );

  if (!isPlayerRecentlyDisconnected) return;

  const [, numPlayers, status] = await pubClient
    .pipeline()
    .srem(currentPlayers, playerValueString(socket))
    .scard(currentPlayers)
    .get(gameStatus)
    .exec();

  sendPlayerList(socket);

  if (!numPlayers[1] && status[1] !== 'finished') {
    // transport close happens if user refreshes page, or their connection dies.
    if (reason !== 'transport close') {
      logger.debug({
        message: '[disconnect] last player disconnected. Ending game.',
      });
      await games.endGame(socket.gameId);
      await pubClient.set(gameStatus, 'finished', 'EX', ONE_DAY);
    }

    // host left on purpose
  } else if (
    socket.isHost &&
    reason === 'client namespace disconnect' &&
    status[1] !== 'finished' &&
    status[1] !== 'postGame'
  ) {
    // set host status in DB
    await gamePlayers.setStatus(socket.playerId, 'left');

    const [questionId, idx] = await pubClient
      .pipeline()
      .get(currentQuestionId)
      .get(currentSequenceIndex)
      .set(gameStatus, 'postGame', 'EX', ONE_DAY)
      .exec();

    console.log(questionId, idx);

    if (idx[1] > 1) {
      // calculate scores
      const result = await saveScores(Number(questionId[1]), socket.gameId);

      logger.debug({
        message: '[HostDisconnect] Score calculation results',
        ...result,
      });

      // end game
      socket.sendToOthers(types.GAME_END, result as payloads.QuestionEnd);
      socket.sendToOthers(types.HOST_LEFT);
    } else {
      logger.debug({
        message: '[HostDisconnect] Host left before first question',
      });

      // set host status in DB
      await gamePlayers.setStatus(socket.playerId, 'left');

      socket.sendToOthers(types.HOST_LEFT_NO_RESULTS); // host left before first question was over. No need to save
    }
  } else if (!socket.isHost && reason === 'client namespace disconnect') {
    const isRemoved = await pubClient.sismember(
      socket.keys.removedPlayers,
      `${socket.playerId}`
    );

    if (!isRemoved) {
      // if the game is over, don't need to do anything
      if (status[1] === 'postGame' || status[1] === 'finished') return;
      else {
        // set player status in DB
        await gamePlayers.setStatus(socket.playerId, 'left');
        await playerLeft(socket, {
          id: socket.playerId,
          player_name: socket.playerName,
        });
        socket.sendToOthers(types.PLAYER_LEFT_GAME, {
          id: socket.playerId,
          player_name: socket.playerName,
        } as PlayerRef);
      }
    }
  }
};

const registerListeners = (socket: Socket, io: Server) => {
  const {
    currentSequenceIndex,
    totalQuestions,
    gameStatus,
    bucketList,
    groupVworld,
    playerMostSimilar,
    locks,
  } = socket.keys;

  // source info
  const source = {
    playerId: socket.playerId,
    playerName: socket.playerName,
    gameId: socket.gameId,
  };

  /**
   * DISCONNECT
   */
  socket.on('disconnect', async (reason) => {
    logger.debug({
      message: '[disconnect] Player disconnected',
      playerId: socket.playerId,
      playerName: socket.playerName,
      isHost: socket.isHost,
      reason, // "client namespace disconnect" = intentional, e.g. player leaves game
    });

    await pubClient.set(
      Keys.recentlyDisconnected(socket.gameId, socket.playerId),
      'true',
      'EX',
      ONE_DAY
    );

    if (reason !== 'transport close') {
      handleDisconnect(socket, reason);
    } else {
      setTimeout(() => {
        handleDisconnect(socket, reason);
      }, 30000);
    }
  });

  /****************************
   * MESSAGE HELPERS
   ****************************/

  // send to connected clients excluding sender
  const sendToOthers = (type: string, payload?: unknown) => {
    socket.to(`${socket.gameId}`).emit(type, payload);

    logOutgoing(type, payload, 'others', source);
  };
  socket.sendToOthers = sendToOthers;

  // send to connected clients including sender
  const sendToAll = (type: string, payload?: unknown) => {
    io.to(`${socket.gameId}`).emit(type, payload);
    logOutgoing(type, payload, 'all', source);
  };

  socket.sendToAll = sendToAll;

  /*******************************************************************
   * EVENT LISTENERS
   *******************************************************************/

  /**
   * PLAYER JOIN
   */
  socket.on(types.PLAYER_JOINED_GAME, (msg: payloads.PlayerEvent) => {
    sendToOthers(types.PLAYER_JOINED_GAME, msg);
  });

  socket.on(types.ONE_LINERS, async (msg: any) => {
    sendOneLiners(socket);
  });

  /**
   * ANSWER PART 1
   */
  socket.on(types.ANSWER_PART_1, async (msg: payloads.AnswerPart1, cb) => {
    logIncoming(types.ANSWER_PART_1, msg, source);

    try {
      await submitAnswerPart1(socket, msg);
      cb('ok');
    } catch (e) {
      logError('[answerPart1] error submiting answer.', e);
      cb('error submitting anser');
    }
  });

  /**
   * ANSWER PART 2
   */
  socket.on(types.ANSWER_PART_2, async (msg: payloads.AnswerPart2, cb) => {
    logIncoming(types.ANSWER_PART_2, msg, source);
    const { playerKey } = socket.keys;

    try {
      const pendingList = await submitAnswerPart2(socket, msg); // returns list of players that havent answered yet

      // store player guess
      await pubClient.set(
        `${playerKey}:${msg.gameQuestionId}:guess`,
        `${msg.guess}`,
        'EX',
        ONE_DAY
      );

      // send list to all clients
      sendToAll(types.SET_HAVE_NOT_ANSWERED, pendingList);

      if (!pendingList.length) {
        const [current, total] = await pubClient
          .pipeline()
          .get(currentSequenceIndex)
          .get(totalQuestions)
          .exec();

        // after 3rd question, start sending facts
        if (current[1] && Number(current[1]) >= 4) {
          await sendFunFacts(socket);
        }

        // if last question, move to game results
        if (current[1] === total[1]) {
          await endGame(socket);
        } else {
          // calculate scores
          const result = await saveScores(msg.gameQuestionId, socket.gameId);

          // send result
          sendToAll(types.QUESTION_END, result as payloads.QuestionEnd);
        }
      }

      cb('ok');
    } catch (e) {
      logError('[submitAnswerPart2] Error', e);
      cb('error');
    }
  });

  // sent by client after receiving a question/game end request. Gets the player most similar to them.
  socket.on(types.FETCH_MOST_SIMILAR, async (_, cb) => {
    try {
      const [r1, r2] = await pubClient
        .pipeline()
        .zrange(playerMostSimilar, -1, -1, 'WITHSCORES')
        .hgetall(`games:${socket.gameId}:mostSimilar`)
        .exec();

      const mostSimilar = r1[1];
      const groupMostSimilar = r2[1];

      const result: payloads.FetchMostSimilar = {
        name: mostSimilar[0] ?? '',
        numSameAnswer: mostSimilar[1] ? Number(mostSimilar[1]) : 0,
        groupMostSimilarNames: groupMostSimilar.players ?? '',
        groupMostSimilarNumber: groupMostSimilar.numSameAnswer
          ? Number(groupMostSimilar.numSameAnswer)
          : 0,
      };

      logger.debug({
        message: '[FetchMostSimilar] result',
        source: socket.playerName,
        result,
      });
      cb(result); // send result back to client
    } catch (e) {
      logError('Error while fetching most similar player', e);
      cb('error');
    }
  });

  /*******************************************************************
   * HOST ONLY LISTENERS
   ********************************************************************/

  if (socket.isHost) {
    /**
     * START GAME
     */
    socket.on(types.START_GAME, async (_, cb) => {
      logIncoming(types.START_GAME, {}, source);

      try {
        const startLock = await pubClient.set(
          `${locks}:start`,
          1,
          'EX',
          5,
          'NX'
        );

        if (!startLock) {
          cb('already started');
          return;
        }
        // update and fetch data from db
        const startResult = await startGame(socket);
        const { game, question, currentCount, haveNotAnswered } = startResult;

        // send question and game state to players
        sendToAll(types.UPDATE_GAME_STATUS, game.status);
        sendToAll(types.SET_QUESTION_STATE, {
          ...question,
          haveNotAnswered,
          numPlayers: currentCount,
          status: 'question',
        } as payloads.SetQuestionState);

        cb('ok');
      } catch (e) {
        logError(`Error while starting  game: ${socket.gameId}.`, e);
        cb('error');
      } finally {
        await pubClient.del(`${locks}:start`);
      }
    });

    /**
     * END GAME
     */
    socket.on(types.END_GAME, async (ack) => {
      logIncoming(types.END_GAME, {}, source);

      const endGameLock = await pubClient.set(
        `${locks}:endGame`,
        1,
        'EX',
        5,
        'NX'
      );

      if (!endGameLock) {
        ack('already ending');
        return;
      }

      try {
        // calculate results
        const result = await endGame(socket);

        if (result) {
          const sequenceIndex = await pubClient.get(currentSequenceIndex);

          // after 4th question, start sending facts
          if (sequenceIndex && Number(sequenceIndex) > 4) {
            const [bucketListResponse, groupVworldResponse] = await pubClient
              .pipeline()
              .hgetall(groupVworld)
              .hgetall(bucketList)
              .exec();

            sendToAll(types.FUN_FACTS, {
              bucketList: bucketListResponse[1],
              groupVworld: groupVworldResponse[1],
            });
          }

          await pubClient.set(gameStatus, 'postGame', 'EX', ONE_DAY);

          // send results
          sendToOthers(
            types.GAME_END_NO_ANNOUNCE,
            result as payloads.QuestionEnd
          );

          // acknowledge complete
          ack('ok');
          return;
        }

        ack('game not in progress');
      } catch (e) {
        logError('Error while ending game', e);
        await pubClient.set(gameStatus, 'inProgress', 'EX', ONE_DAY); // reset so request can be sent again
        ack('error');
      } finally {
        await pubClient.del(`${locks}:endGame`);
      }
    });

    /**
     * REMOVE PLAYER
     */
    socket.on(types.REMOVE_PLAYER, async (msg: payloads.PlayerEvent, ack) => {
      logIncoming(types.REMOVE_PLAYER, msg, source);

      try {
        await removePlayer(socket, msg);
        ack('ok');
      } catch (e) {
        logError('Error while removing player from game', e);
        ack('error');
      }
    });

    /**
     * SKIP QUESTION
     */
    socket.on(types.SKIP_QUESTION, async (msg: payloads.QuestionSkip, ack) => {
      logIncoming(types.SKIP_QUESTION, msg, source);

      const skipLock = await pubClient.set(
        `${locks}:skipQuestion`,
        1,
        'EX',
        5,
        'NX'
      );

      if (!skipLock) {
        ack('already in progress');
        return;
      }

      try {
        // check if last question
        const [currentIndex, total] = await pubClient.mget(
          currentSequenceIndex,
          totalQuestions
        );

        if (Number(currentIndex) >= Number(total)) {
          // calculate results
          const result = await endGame(socket);

          const [bucketListResponse, groupVworldResponse] = await pubClient
            .pipeline()
            .hgetall(groupVworld)
            .hgetall(bucketList)
            .exec();

          sendToAll(types.FUN_FACTS, {
            bucketList: bucketListResponse[1],
            groupVworld: groupVworldResponse[1],
          });

          await pubClient.set(gameStatus, 'postGame', 'EX', ONE_DAY);

          // send results
          sendToAll(types.GAME_END, result as payloads.QuestionEnd);

          // acknowledge complete
          ack('ok');
        } else {
          const nextQuestionResult = await nextQuestion(socket);
          sendToAll(types.SET_QUESTION_STATE, {
            ...nextQuestionResult,
            status: 'question',
          } as payloads.SetQuestionState);

          ack('ok');
        }

        // This just tells the UI on every client to display the message modal
        sendToAll(types.SKIP_QUESTION);
      } catch (e) {
        logError('Error while skipping question', e);
        ack('error');
      } finally {
        // release lock no matter what
        await pubClient.del(`${locks}:skipQuestion`);
      }
    });

    /**
     * MOVE TO SCORES FROM ANSWERS
     */
    socket.on(types.MOVE_TO_QUESTION_RESULTS, () => {
      pubClient.set(socket.keys.currentQuestionStatus, 'results');
      sendToAll(types.MOVE_TO_QUESTION_RESULTS);
    });

    /**
     * READER TAKEOVER
     */
    socket.on(types.HOST_TAKE_OVER_READING, (msg: payloads.PlayerEvent) => {
      logIncoming(types.HOST_TAKE_OVER_READING, msg, source);
      sendToAll(types.SET_READER, msg);
    });

    /**
     * END QUESTION AND MOVE TO ANSWERS
     */
    socket.on(types.MOVE_TO_ANSWER, async (msg: payloads.QuestionSkip, ack) => {
      pubClient.set(socket.keys.currentQuestionStatus, 'answer');
      logIncoming(types.MOVE_TO_ANSWER, msg, source);

      // acquire lock
      const endQuestionLock = await pubClient.set(
        `${locks}:endQuestion`,
        1,
        'EX',
        5,
        'NX'
      );

      if (!endQuestionLock) {
        ack('in progress');
        return;
      }

      try {
        let result: payloads.QuestionEnd;
        const [sequenceIndex, total] = await pubClient.mget(
          currentSequenceIndex,
          totalQuestions
        );

        if (sequenceIndex && total && Number(sequenceIndex) >= Number(total)) {
          await endGame(socket);
        } else {
          // calculate scores
          result = await saveScores(msg.gameQuestionId, socket.gameId);
          logger.debug({
            message: '[EndQuestion/notLast] Score calculation results',
            ...result,
          });

          sendToAll(types.QUESTION_END, result as payloads.QuestionEnd);
        }

        // after 4th question, start sending facts
        if (sequenceIndex && Number(sequenceIndex) > 4) {
          await sendFunFacts(socket);
        }

        ack('ok');
      } catch (e) {
        logError('Error skipping to results', e);
        ack('error');
      } finally {
        // release lock
        await pubClient.del(`${locks}:endQuestion`);
      }
    });

    /**
     * NEXT QUESTION
     */
    socket.on(types.START_NEXT_QUESTION, async (_, ack) => {
      logIncoming(types.START_NEXT_QUESTION, {}, source);

      // acquire lock
      const nextQuestionLock = await pubClient.set(
        `${locks}:nextQuestion`,
        1,
        'EX',
        5,
        'NX'
      );

      if (!nextQuestionLock) {
        ack('in progress');
        return;
      }

      try {
        const nextQuestionResult = await nextQuestion(socket);
        sendToAll(types.SET_QUESTION_STATE, {
          ...nextQuestionResult,
          status: 'question',
        } as payloads.SetQuestionState);

        ack('ok');
      } catch (e) {
        logError('Error while starting question', e);
        ack('error');
      } finally {
        // release lock
        await pubClient.del(`${locks}:nextQuestion`);
      }
    });
  }
};

export default registerListeners;
