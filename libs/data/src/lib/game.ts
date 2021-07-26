import { Sequelize, Optional, Model, INTEGER, STRING } from 'sequelize';

interface GamesAttributes {
  id: number;
  pin: string;
  deckId: number;
  rating: string;
  numberOfPlayers: number;
  email: string;
  resultEmailSent: string;
  ipAddress: string;
}

type GamesCreationAttributes = Optional<GamesAttributes, 'id'>;

export class GameModel extends Model<GamesAttributes, GamesCreationAttributes> implements GamesAttributes {
  createdAt: Date;
  updatedAt: Date;
  deckId: number;
  email: string;
  id: number;
  ipAddress: string;
  numberOfPlayers: number;
  pin: string;
  rating: string;
  resultEmailSent: string;
}

export function gameFactory(sequelize: Sequelize): typeof GameModel {
  GameModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      deckId: {
        allowNull: false,
        type: INTEGER,
      },
      pin: {
        allowNull: false,
        type: STRING,
      },
      rating: {
        allowNull: false,
        type: STRING,
      },
      numberOfPlayers: {
        allowNull: false,
        type: INTEGER,
      },
      email: {
        allowNull: false,
        type: STRING,
      },
      resultEmailSent: {
        allowNull: false,
        type: STRING,
      },
      ipAddress: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      tableName: 'games',
      sequelize: sequelize,
      underscored: true,
    },
  );

  return GameModel;
}
