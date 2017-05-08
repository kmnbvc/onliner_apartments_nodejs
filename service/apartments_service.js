const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'onliner_apartments',
    user: 'root',
    password: 'root'
});

connection.connect();

const getAll = () => {
    return query('SELECT * FROM apartments');
};

const save = (apartments) => {
    connection.beginTransaction(function (err) {
        if (err) throw err;

        apartments.forEach(ap => {
            connection.query('INSERT INTO apartments SET ?', ap, function (error, results, fields) {
                if (error) {
                    return connection.rollback(function () {
                        throw error;
                    });
                }
                connection.commit(function (err) {
                    if (err) {
                        return connection.rollback(function () {
                            throw err;
                        });
                    }
                    console.log('successfully saved apartment', ap.id);
                });
            });
        });
    });
};

const filterNew = (apartments) => {
    return getAll().then((existed) => {
        const existed_ids = existed.map(a => a.id);
        return apartments.filter(a => !existed_ids.includes(a.id));
    })
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

// connection.end();

module.exports = {
    getAll,
    save
};