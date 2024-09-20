import { seq_connection } from "../connection";
import { Model, Sequelize, DataTypes, Op } from "sequelize";
import { generate_salt } from "../../secure/bcrypt";
const sequelize = seq_connection.sequelize;

interface UsernameSchema {
    username: string, 
    email: string,
}
interface UserLoginSchema extends Partial<UsernameSchema> {
    password: string,
    role?: string[]
}

export class User extends Model{
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: string[];
    declare active: boolean;
    declare session_tk: string;
    declare created_at: Date;

    // QUERIES
    static async register(props: UserLoginSchema): Promise<User> { 
        console.log(JSON.stringify(props, null, 4))
        // need to call password salt and hash
        return await User.create({
            ...props
        })
    }

    static async findUser(props: UsernameSchema): Promise<User> {
        if (props.username && props.email) {
            return await User.findOne({
                attributes: ['id', 'username', 'email'],
                where: {
                    [Op.or]: [
                        {username: props.username},
                        {email: props.email}
                    ]
                }
            })
        }
        else {
            throw new Error('Usage: missing parameters: username or email at User.findUser()')
        }
    }
    static async login(props: UserLoginSchema): Promise<User> {
        // need to call password salt and hash
        generate_salt(props.password);
        if (props.username) { 
            return await User.findOne(
                {
                    attributes: ['id', 'role', 'password'],
                    where: {
                        [Op.and]: [
                            { username: props.username },
                            { password: props.password }
                        ]
                    }
                }
            );
        }
        else if (props.email) {
            return await User.findOne(
                {
                    where: {
                        [Op.and]: [
                            { email: props.email },
                            { password: props.email }
                        ]
                    }
                }
            )
        }
        else throw new Error('Usage: invalid parameters sent to login')
    }
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
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
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

User.sync({alter: true});


// === Debuggers ===
export async function printTables() {
    console.log(await sequelize.getQueryInterface().showAllTables())
}

