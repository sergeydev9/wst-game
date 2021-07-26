import { Sequelize, Optional, Model, INTEGER, STRING } from 'sequelize';

export interface QuestionsAttributes {
  id: number;
  questionText: string;
  questionTextForGuess: string;
  questionFollowUp: string;
  questionCategory: string;
  questionRating: string;
  questionStatus: string;
  questionNoTrue: number;
  questionNoFalse: number;
}

type QuestionsCreationAttributes = Optional<QuestionsAttributes, 'id'>;

export class QuestionsModel extends Model<QuestionsAttributes, QuestionsCreationAttributes> implements QuestionsAttributes {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  questionCategory: string;
  questionFollowUp: string;
  questionNoFalse: number;
  questionNoTrue: number;
  questionRating: string;
  questionStatus: string;
  questionText: string;
  questionTextForGuess: string;
}

export function questionFactory(sequelize: Sequelize): typeof QuestionsModel {
  QuestionsModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      questionText: {
        allowNull: false,
        type: STRING,
      },
      questionTextForGuess: {
        allowNull: false,
        type: STRING,
      },
      questionFollowUp: {
        allowNull: false,
        type: STRING,
      },
      questionCategory: {
        allowNull: false,
        type: STRING,
      },
      questionRating: {
        allowNull: false,
        type: STRING,
      },
      questionStatus: {
        allowNull: false,
        type: STRING,
      },
      questionNoTrue: {
        allowNull: false,
        type: INTEGER,
      },
      questionNoFalse: {
        allowNull: false,
        type: INTEGER,
      },
    },
    {
      tableName: 'questions',
      sequelize: sequelize,
      underscored: true,
    },
  );

  return QuestionsModel;
}
