import { seq_connection } from "../connection";
import { Model, Sequelize, DataTypes } from "sequelize";

const sequelize = seq_connection.sequelize;

export class User extends Model{
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: string[];
    declare active: boolean;
    declare session_tk: string;
    declare created_at: Date;

}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            defaultValue: ['user'],
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }, 
        session_tk: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, 
    {
        sequelize,
        modelName: 'user',
        timestamps: true
    }
)

User.sync();


// === Debuggers ===
export async function printTables() {
    console.log(await sequelize.getQueryInterface().showAllTables())
}

