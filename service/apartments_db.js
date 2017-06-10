const mysql = require('mysql');
const apartments_model = require('../model/apartments');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'onliner_apartments',
    user: 'root',
    password: 'root'
});

connection.connect();

const getAll = () => {
    return query('SELECT * FROM apartments ORDER BY updated DESC');
};

const getFavorites = () => {
    return query('SELECT * FROM apartments a WHERE a.favorite = TRUE');
};

const save = (apartments) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            const ids = apartments_model.ids(apartments);
            connection.query('DELETE FROM apartments WHERE id IN (?)', [ids], rollbackOnError(() => {
                const query = `INSERT INTO apartments (${apartments_model.fields().join(',')}) VALUES ?`;
                const params = [apartments_model.toArray(apartments)];
                connection.query(query, params, rollbackOnError(() => connection.commit(rollbackOnError(resolve))));
            }));
        })
    )
};

const filterNew = (apartments) => {
    return getAll().then((existed) => {
        const existed_ids = apartments_model.ids(existed);
        return apartments.filter(a => !existed_ids.includes(a.id));
    })
};

const deleteAll = () => {
    return query('DELETE FROM apartments');
};

const toggleFavorite = (apartment) => {
    return query('SELECT * FROM apartments WHERE id = ?', apartment.id).then(existed => {
        const actual = existed[0] || apartment;
        return existed[0]
            ? query('UPDATE apartments SET favorite = ? WHERE id = ?', [!actual.favorite, actual.id])
            : query('INSERT INTO apartments SET ?', Object.assign(actual, {favorite: true}));
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

const rollbackOnError = (callback) => (error) => {
    if (error) {
        return connection.rollback(() => {
            throw error;
        })
    }
    if (callback) callback();
};

// connection.end();

module.exports = {
    getAll,
    save,
    getFavorites,
    filterNew,
    deleteAll,
    toggleFavorite
};