import mysql from '../config/mysql';

/**
 * @name Connect
 * @description Create a mysql connection flow in a promise
 * @param {String} query Query data 
 * @param {Array|object} params Params
 * @return {Promise<[object]>} DB Query result
 */
const connect = (query: string, params: Array< string | number> = []) => new Promise((resolve, reject) => {
    const connection = mysql();
    connection.connect()
    connection.query(query, params, (err, res) => {
        connection.end();
        if (err) {
            reject(err);
        }
        resolve({
            data: res,
            error: false
        });
    });
}).catch(err => (
    {
        data: {
            message: err.message
        },
        error: true
    })
);

export default { connect };