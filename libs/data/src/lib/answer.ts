import { Sequelize, Optional, Model, INTEGER, STRING } from 'sequelize';

export interface AnswerAttributes {
  id: number;
  questionId: number;
  gameId: number;
  gamePlayerId: number;
  answerResult: string;
  answerNumberTrueGuess: number;
  answerPercentTrueGuess: number;
  answerLocation: string;
  answerIpAddress: string;
}

type AnswerCreationAttributes = Optional<AnswerAttributes, 'id'>;

export class AnswerModel extends Model<AnswerAttributes, AnswerCreationAttributes> implements AnswerAttributes {
  createdAt: Date;
  updatedAt: Date;
  answerIpAddress: string;
  answerLocation: string;
  answerNumberTrueGuess: number;
  answerPercentTrueGuess: number;
  answerResult: string;
  gameId: number;
  gamePlayerId: number;
  id: number;
  questionId: number;
}

export function answerFactory(sequelize: Sequelize): typeof AnswerModel {
  AnswerModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      questionId: {
        allowNull: false,
        type: INTEGER,
      },
      gameId: {
        allowNull: false,
        type: INTEGER,
      },
      gamePlayerId: {
        allowNull: false,
        type: INTEGER,
      },
      answerResult: {
        allowNull: false,
        type: STRING,
      },
      answerNumberTrueGuess: {
        allowNull: false,
        type: INTEGER,
      },
      answerPercentTrueGuess: {
        allowNull: false,
        type: INTEGER,
      },
      answerLocation: {
        allowNull: false,
        type: STRING,
      },
      answerIpAddress: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      tableName: 'answers',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return AnswerModel;
}
