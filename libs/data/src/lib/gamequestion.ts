import { Sequelize, Optional, Model, INTEGER, STRING } from 'sequelize';

interface GamesQuestionAttributes {
  id: number;
  deckId: number;
  questionId: number;
  questionSequence: number;
  gameId: number;
  numberOfTrue: number;
  numberOfFalse: number;
  numberOfPass: number;
  totalAnswers: number;
  rating: number;
}

type GamesQuestionCreationAttributes = Optional<GamesQuestionAttributes, 'id'>;

export class GamesQuestionModel extends Model<GamesQuestionAttributes, GamesQuestionCreationAttributes> implements GamesQuestionAttributes {
  createdAt: Date;
  updatedAt: Date;
  deckId: number;
  gameId: number;
  id: number;
  numberOfFalse: number;
  numberOfPass: number;
  numberOfTrue: number;
  questionId: number;
  questionSequence: number;
  rating: number;
  totalAnswers: number;
}

export function gameQuestionFactory(sequelize: Sequelize): typeof GamesQuestionModel {
  GamesQuestionModel.init(
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
      questionId: {
        allowNull: false,
        type: INTEGER,
      },
      questionSequence: {
        allowNull: false,
        type: INTEGER,
      },
      gameId: {
        allowNull: false,
        type: INTEGER,
      },
      rating: {
        allowNull: false,
        type: STRING,
      },
      numberOfTrue: {
        allowNull: false,
        type: INTEGER,
      },
      numberOfFalse: {
        allowNull: false,
        type: INTEGER,
      },
      totalAnswers: {
        allowNull: false,
        type: INTEGER,
      },
      numberOfPass: {
        allowNull: false,
        type: INTEGER,
      },
    },
    {
      tableName: 'gameQuestions',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return GamesQuestionModel;
}
