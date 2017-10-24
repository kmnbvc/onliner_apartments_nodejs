const mysql = require('mysql');
const config = require('../config').db;

const state = {
    pool: null
};

const get_pool = () => {
    return state.pool;
};

const connect = function (callback) {
    state.pool = mysql.createPool({
        connectionLimit: 5,
        host: config.host,
        database: config.database,
        user: config.user,
        password: config.password,
        port: config.port,
        dateStrings: true,
        typeCast: function (field, next) {
            if (field.type === 'TINY' && field.length === 1) {
                return (field.string() === '1');
            }
            return next();
        }
    });

    callback();
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        get_pool().query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            else resolve(rows);
        })
    })
};

const tx = (connection) => {
    let _resolve;
    let _reject;
    let _try = 0;

    const start = (callback) => {
        return new Promise((resolve, reject) =>
            connection.beginTransaction(error => {
                if (error)
                    reject(error);
                else {
                    _resolve = resolve;
                    _reject = reject;
                    callback();
                }
            })
        ).catch(err => {
            if (err.code === 'ER_LOCK_DEADLOCK' && _try < 3) {
                console.error('Deadlock found when trying to get lock; restarting transaction, try: %s', _try);
                _try += 1;
                return new Promise(resolve => setTimeout(resolve, 500)).then(() => start(callback));
            }
            throw err;
        })
    };

    const action = (callback) => (error, results) => {
        if (error) {
            return connection.rollback(() => {
                _reject(error);
            })
        }
        if (callback) callback(results);
    };

    const commit = action(() => {
        connection.commit(action(_resolve));
        connection.release();
    });

    return {connection, start, action, commit};
};

const createTx = () => {
    return new Promise((resolve, reject) =>
        get_pool().getConnection((error, connection) => {
            if (error)
                reject(error);
            else
                resolve(tx(connection));
        })
    );
};

module.exports = {
    connect,
    query,
    createTx
};