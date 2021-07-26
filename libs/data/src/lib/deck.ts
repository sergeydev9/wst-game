import { Sequelize, Optional, Model, INTEGER, STRING, DECIMAL } from 'sequelize';

export interface DecksAttributes {
  id: number;
  deckSortOrder: number;
  deckName: string;
  deckClean: string;
  deckAgeRating: string;
  deckMovieRating: string;
  deckSFW: string;
  deckStatus: string;
  deckDesc: string;
  deckPrice: number;
  deckOriginalPrice: number;
  deckPurchaseCount: number;
  deckPlayCount: number;
  deckFavoritesCount: number;
  deckRatingGreat: number;
  deckRatingBad: number;
  deckPercentGreat: number;
  deckType: string;
}

type DecksCreationAttributes = Optional<DecksAttributes, 'id'>;

export class DecksModel extends Model<DecksAttributes, DecksCreationAttributes> implements DecksAttributes {
  createdAt: Date;
  updatedAt: Date;
  deckAgeRating: string;
  deckClean: string;
  deckDesc: string;
  deckFavoritesCount: number;
  deckMovieRating: string;
  deckName: string;
  deckOriginalPrice: number;
  deckPercentGreat: number;
  deckPlayCount: number;
  deckPrice: number;
  deckPurchaseCount: number;
  deckRatingBad: number;
  deckRatingGreat: number;
  deckSFW: string;
  deckSortOrder: number;
  deckStatus: string;
  deckType: string;
  id: number;
}

export function deckFactory(sequelize: Sequelize): typeof DecksModel {
  DecksModel.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      deckSortOrder: {
        allowNull: false,
        type: INTEGER,
      },
      deckName: {
        allowNull: false,
        type: STRING,
      },
      deckClean: {
        allowNull: false,
        type: STRING,
      },
      deckAgeRating: {
        allowNull: false,
        type: STRING,
      },
      deckMovieRating: {
        allowNull: false,
        type: STRING,
      },
      deckSFW: {
        allowNull: false,
        type: STRING,
      },
      deckStatus: {
        allowNull: false,
        type: STRING,
      },
      deckDesc: {
        allowNull: false,
        type: STRING,
      },
      deckPrice: {
        allowNull: false,
        type: DECIMAL,
      },
      deckOriginalPrice: {
        allowNull: false,
        type: INTEGER,
      },
      deckPurchaseCount: {
        allowNull: false,
        type: INTEGER,
      },
      deckPlayCount: {
        allowNull: false,
        type: INTEGER,
      },
      deckFavoritesCount: {
        allowNull: false,
        type: INTEGER,
      },
      deckRatingGreat: {
        allowNull: false,
        type: INTEGER,
      },
      deckRatingBad: {
        allowNull: false,
        type: INTEGER,
      },
      deckPercentGreat: {
        allowNull: false,
        type: DECIMAL,
      },
      deckType: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      tableName: 'decks',
      sequelize: sequelize,
      underscored: true,
    },
  );
  return DecksModel;
}
