import GameService from "./game.service";
import {Socket} from "socket.io";
import {PlayerJoinGame, WebsocketMessage} from "@whosaidtrue/api-interfaces";
import Player from "../game/player";

class SocketioService {

  public constructor(
      private readonly gameService: GameService) {
  }

  public async handle(socket: Socket) {
    try {
      console.log("SocketioService.handle", socket.data);
      const gameCode = socket.data.gameCode;
      const playerId = socket.data.playerId;

      const player = await this.gameService.connectPlayer(playerId, gameCode);
      socket.join(socket.data.gameCode);
      const sendMessage = msg => socket.to(socket.data.gameCode).emit(msg.event, msg);

      const msg: WebsocketMessage = {
        event: 'GameConnected',
        status: 'success',
        payload: {gameCode: player.game.gameRow.access_code, playerId: player.playerId}
      };
      sendMessage(msg);

      // socket <--> player glue
      player.on('message', sendMessage);
      this.handleGameEvents(player, socket);

      socket.on("error", (err) => {
        console.log("error", err);
      });

      socket.on("disconnecting", (reason) => {
        console.log("disconnecting", reason);
      });

      socket.on("disconnect", (reason) => {
        console.log("disconnect", reason);

        this.gameService.disconnectPlayer(player);

        // no longer react to player messages
        socket.removeAllListeners();
        player.off('message', sendMessage);
      });

    } catch (e) {
      console.error('SocketioService.handle', e);
      socket.emit('error', e);
      socket.disconnect(true);

      // propagate to caller to handle rest
      throw e;
    }
  };

  private handleGameEvents = (player: Player, socket: Socket) => {

    const game = player.game;

    // debug
    socket.onAny((event, msg) => {
      console.log(event, msg);
    });

    socket.on('HostJoinGame', async data => {
      player.hostOverride = true;
      await this.gameService.joinGame(player, (data as PlayerJoinGame).payload.player_name);
    });

    socket.on('PlayerJoinGame', async data => {
      await this.gameService.joinGame(player, (data as PlayerJoinGame).payload.player_name);
    });

    socket.on('NextQuestion', async data => {
      if (player.game.isFinalQuestion()) {
        await this.gameService.hostShowFinalScores(game, player);
      } else {
        await this.gameService.hostNextQuestion(game, player);
      }
    });

    socket.on('AnswerPart1', async data => {
      await this.gameService.submitAnswerPart1(game, player, data.payload);
    });

    socket.on('AnswerPart2', async data => {
      await this.gameService.submitAnswerPart2(game, player, data.payload);
    });

    socket.on('ShowResults', async data => {
      await this.gameService.hostShowResults(game, player);
    });

    socket.on('ShowScores', async data => {
      await this.gameService.hostShowScores(game, player);
    });

    socket.on('ShowFinalScores', async data => {
      await this.gameService.hostShowFinalScores(game, player);
    });
  };

}

export default SocketioService;
