import { Optional, Model, Sequelize, INTEGER, STRING, BOOLEAN } from 'sequelize';
import { User } from './user';

interface UserDecksAttributes {
  id: number;
  userId: number;
  deckId: number;
  favorite: boolean;
  subscription: string;
}

export type UserDeckCreationAttributes = Optional<User, 'id'>;

export class UserDecksModel extends Model<UserDecksAttributes, UserDeckCreationAttributes> implements UserDecksAttributes {
  createdAt: Date;
  updatedAt: Date;
  deckId: number;
  favorite: boolean;
  id: number;
  subscription: string;
  userId: number;
}

export function userDeckFactory(sequelize: Sequelize): typeof UserDecksModel {
  UserDecksModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      userId: {
        allowNull: false,
        type: INTEGER,
      },
      deckId: {
        allowNull: false,
        type: INTEGER,
      },
      favorite: {
        allowNull: false,
        type: BOOLEAN,
      },
      subscription: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      tableName: 'userDecks',
      sequelize,
      underscored: true,
    },
  );
  return UserDecksModel;
}
