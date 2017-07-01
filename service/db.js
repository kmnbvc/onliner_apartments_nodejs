const mysql = require('mysql');

const state = {
    pool: null
};

const get_pool = () => {
    return state.pool;
};

const connect = function (callback) {
    state.pool = mysql.createPool({
        connectionLimit: 5,
        host: 'localhost',
        database: 'onliner_apartments',
        user: 'root',
        password: 'root'
    });

    callback();
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        get_pool().query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const tx = (connection) => {
    const start = (callback) => {
        return new Promise((resolve, reject) =>
            connection.beginTransaction(error => {
                if (error) throw error;

                callback(resolve, reject);
            })
        )
    };

    const action = (callback) => (error) => {
        if (error) {
            return connection.rollback(() => {
                throw error;
            })
        }
        if (callback) callback();
    };

    const commit = (callback) => {
        return action(() => {
            connection.commit(action(callback));
            connection.release();
        })
    };

    return {connection, start, action, commit};
};

const createTx = () => {
    return new Promise((resolve, reject) =>
        get_pool().getConnection((error, connection) => {
            if (error) throw error;

            resolve(tx(connection));
        })
    );
};

module.exports = {
    connect,
    query,
    createTx
};