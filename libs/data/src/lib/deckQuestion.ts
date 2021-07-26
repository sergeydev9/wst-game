import { Sequelize, Optional, Model, INTEGER } from 'sequelize';

export interface DeckQuestionsAttributes {
  id: number;
  deckId: number;
  questionId: number;
}

type DeckQuestionsCreationAttributes = Optional<DeckQuestionsAttributes, 'id'>;

export class DeckQuestionModel extends Model<DeckQuestionsAttributes, DeckQuestionsCreationAttributes> implements DeckQuestionsAttributes {
  createdAt: Date;
  updatedAt: Date;
  deckId: number;
  id: number;
  questionId: number;
}

export function deckQuestionFactory(sequelize: Sequelize): typeof DeckQuestionModel {
  DeckQuestionModel.init(
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
    },
    {
      tableName: 'deckQuestions',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return DeckQuestionModel;
}
