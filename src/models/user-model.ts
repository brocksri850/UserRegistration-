import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';

interface MyModel extends Model { }

export type UserModelStatic = typeof Model & { new(values?: object, options?: BuildOptions): MyModel; }

export default function (sequelize: Sequelize): UserModelStatic {
    let user = <UserModelStatic>sequelize.define("User", {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        salt: {
            type: DataTypes.STRING
        },
        password_string: {
            type: DataTypes.STRING
        },
        key: {
            type: DataTypes.STRING
        },
        payload: {
            type: DataTypes.JSON,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "Active"
        },
        created_at: {
            type: DataTypes.DATE,
        },
        updated_at: {
            type: DataTypes.DATE,
        },
        is_attempts: {
            type: DataTypes.INTEGER,
        }

    }, {
        indexes: [],
        timestamps: false,
        freezeTableName: true,
        tableName: 'user'
    });

    return user;
}
