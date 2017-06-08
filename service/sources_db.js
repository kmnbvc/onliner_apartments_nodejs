const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'onliner_apartments',
    user: 'root',
    password: 'root'
});

connection.connect();

const getAllSources = () => {
    return query("SELECT * FROM sources");
};

const getActiveSources = () => {
    return query('SELECT * FROM sources WHERE active = TRUE');
};

const update = (source) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            connection.query('UPDATE sources SET ? WHERE name = ?', [source, source.name],
                rollbackOnError(() => connection.commit(rollbackOnError(resolve))));
        })
    );
};

const remove = (name) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            connection.query('DELETE FROM sources WHERE name = ?', [name],
                rollbackOnError(() => connection.commit(rollbackOnError(resolve))));
        })
    );
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const rollbackOnError = (callback) => (error) => {
    if (error) {
        return connection.rollback(() => {
            throw error;
        })
    }
    if (callback) callback();
};

module.exports = {
    getAllSources,
    getActiveSources,
    update,
    remove
};

