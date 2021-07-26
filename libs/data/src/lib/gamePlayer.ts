import { Sequelize, Optional, Model, INTEGER, STRING, BOOLEAN } from 'sequelize';

export interface GamePlayersAttributes {
  id: number;
  gameId: number;
  playerNameId: number;
  playerIpAddress: string;
  gameCreator: boolean;
  playerLastQuestionScore: number;
  playerScore: number;
  playerRank: number;
}

type GamePlayersCreationAttributes = Optional<GamePlayersAttributes, 'id'>;

export class GamePlayersModel extends Model<GamePlayersAttributes, GamePlayersCreationAttributes> implements GamePlayersAttributes {
  createdAt: Date;
  updatedAt: Date;
  gameCreator: boolean;
  gameId: number;
  id: number;
  playerIpAddress: string;
  playerLastQuestionScore: number;
  playerNameId: number;
  playerRank: number;
  playerScore: number;
}

export function gamePlayerFactory(sequelize: Sequelize): typeof GamePlayersModel {
  GamePlayersModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      gameId: {
        allowNull: false,
        type: INTEGER,
      },
      playerNameId: {
        allowNull: false,
        type: INTEGER,
      },
      playerIpAddress: {
        allowNull: false,
        type: STRING,
      },
      gameCreator: {
        allowNull: false,
        type: BOOLEAN,
      },
      playerLastQuestionScore: {
        allowNull: false,
        type: INTEGER,
      },
      playerScore: {
        allowNull: false,
        type: INTEGER,
      },
      playerRank: {
        allowNull: false,
        type: INTEGER,
      },
    },
    {
      tableName: 'gamePlayers',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return GamePlayersModel;
}
