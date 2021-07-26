import { Sequelize, Model, Optional, BOOLEAN, DATE, STRING, INTEGER } from 'sequelize';

export interface User {
    id: number;
    email: string;
    password: string;
    status: string;
    accountType: number;
    screenName: string;
    firstName: string;
    lastName: string;
    activationCode: string;
    activated: boolean;
    dob: Date;
    ipAddress: string;
}

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
    public id: number;
    public email: string;
    public password: string;
    public status: string;
    public accountType: number;
    public screenName: string;
    public firstName: string;
    public lastName: string;
    public activationCode: string;
    public activated: boolean;
    public dob: Date;
    public ipAddress: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function userFactory(sequelize: Sequelize): typeof UserModel {
    UserModel.init(
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: INTEGER,
            },
            email: {
                allowNull: false,
                type: STRING,
            },
            password: {
                allowNull: false,
                type: STRING,
            },
            status: {
                allowNull: false,
                type: STRING,
                defaultValue: 'Good',
            },
            accountType: {
                allowNull: false,
                type: STRING,
            },
            screenName: {
                allowNull: true,
                type: STRING,
            },
            firstName: {
                allowNull: true,
                type: STRING,
            },
            lastName: {
                allowNull: true,
                type: STRING,
            },
            activationCode: {
                allowNull: true,
                type: STRING,
            },
            activated: {
                allowNull: false,
                type: BOOLEAN,
                defaultValue: false,
            },
            dob: {
                allowNull: true,
                type: DATE,
            },
            ipAddress: {
                allowNull: true,
                type: STRING,
            },
        },
        {
            tableName: 'users',
            sequelize,
            underscored: true,
        },
    );
    return UserModel;
}
