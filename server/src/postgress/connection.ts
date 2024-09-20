import 'dotenv';
import { Sequelize } from 'sequelize';

/**
 * Handles setup and tear down of sequelize connection. 
*/
class Connection_handler {
    public sequelize: Sequelize;
    public start_time: number = Date.now();
    public end_time: number;
    public restarts: number = 0;

    static create_sequelizer(): Sequelize {
        return new Sequelize(process.env.CNCT_STRING, {
            logging: false
        });
    }

    constructor(sequelize: Sequelize) {
        if (sequelize === null) {
            sequelize = Connection_handler.create_sequelizer();
        }

        this.sequelize = sequelize
    }

    public async start_connection() { 
        try { 
            await this.sequelize.authenticate();
            console.log('postgress connection success!')
        }   
        catch (error) {
            this.end_time = Date.now();
            throw new Error('Unable to start postgress connection: ' + error.message);
        }
    }

    public async close_connection() { 
        try {
            await this.sequelize.close();
            this.end_time = Date.now();
        } catch (error) {
            this.end_time = Date.now();
            throw new Error('Unable to close postgress connection' + error.message);
        }
    }

    public async restart_connection() {
        try {
            await this.sequelize.close();

            this.sequelize = Connection_handler.create_sequelizer();
            this.start_connection();
            this.restarts += 1;
        } catch (error) {
            this.end_time = Date.now();
            throw new Error('Unable to restart postgress connection' + error.message);
        }
    }
}


export var seq_connection = new Connection_handler(null);
