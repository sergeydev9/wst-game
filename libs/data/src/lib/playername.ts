import { Sequelize, Optional, Model, INTEGER, STRING } from 'sequelize';

export interface PlayerNamesAttributes {
  id: number;
  playerName: string;
  playerNameClean: string;
  playerNameRandom: number;
  playerNameTimesDisplayed: number;
  playerNameTimesChosen: number;
}

type PlayerNameCreationAttributes = Optional<PlayerNamesAttributes, 'id'>;

export class PlayerNamesModel extends Model<PlayerNamesAttributes, PlayerNameCreationAttributes> implements PlayerNamesAttributes {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  playerName: string;
  playerNameClean: string;
  playerNameRandom: number;
  playerNameTimesChosen: number;
  playerNameTimesDisplayed: number;
}

export function playerNameFactory(sequelize: Sequelize): typeof PlayerNamesModel {
  PlayerNamesModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      playerName: {
        allowNull: false,
        type: STRING,
      },
      playerNameClean: {
        allowNull: false,
        type: STRING,
      },
      playerNameRandom: {
        allowNull: false,
        type: INTEGER,
      },
      playerNameTimesDisplayed: {
        allowNull: false,
        type: INTEGER,
      },
      playerNameTimesChosen: {
        allowNull: false,
        type: INTEGER,
      },
    },
    {
      tableName: 'playerNames',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return PlayerNamesModel;
}
