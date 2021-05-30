import * as mysql from 'mysql';
import env from './env';

/**
 * @name Create Connection
 * @description Create connection with mysql database
 * @author Everson F. Feltrin
 * @since 2021-05-29
 */
const createConnection = () => {
    const connection = mysql.createConnection({
        database: env.database,
        host: env.dbhost,
        multipleStatements: true,
        password: env.dbpassword,
        port: env.dbPort,
        user: env.dbuser
    });
    return connection;
};

export default () => {
    return createConnection();
};