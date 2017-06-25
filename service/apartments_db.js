const mysql = require('mysql');
const apartments_model = require('../model/apartments');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'onliner_apartments',
    user: 'root',
    password: 'root'
});

//todo connection pool
connection.connect();

const getAll = () => {
    return query('SELECT * FROM apartments ORDER BY updated DESC');
};

const getActive = () => {
    return query('SELECT * FROM apartments a WHERE a.active = TRUE ORDER BY a.updated DESC');
};

const getFavorites = () => {
    return query('SELECT * FROM apartments a WHERE a.favorite = TRUE');
};

const save = (apartments) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            const ids = apartments_model.ids(apartments);
            connection.query('DELETE FROM apartments WHERE id IN (?)', [ids], actionTx(() => {
                const query = `INSERT INTO apartments (${apartments_model.fields().join(',')}) VALUES ?`;
                const params = [apartments_model.toArray(apartments)];
                connection.query(query, params, actionTx(() => connection.commit(actionTx(resolve))));
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

const save_details = (apartment) => {
    const id = apartment.id;
    const details = apartment.details;
    const images = details.images || [];
    delete details.images;
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            connection.query('UPDATE apartments SET ? WHERE id = ?', [details, id],
                (images.length > 0) ? save_images(id, images, resolve) : commitTx(resolve));
        })
    );
};

const save_images = (id, images = [], resolve) => {
    if (images.length > 0) {
        connection.query('DELETE FROM images WHERE apartment_id = ?', [id], actionTx(() => {
            const query = 'INSERT INTO images (apartment_id, url) VALUES ?';
            const params = [images.map(img => [id, img])];
            connection.query(query, params, commitTx(resolve));
        }))
    }
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const beginTx = (callback) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            callback();
        })
    )
};

const actionTx = (callback) => (error) => {
    if (error) {
        return connection.rollback(() => {
            throw error;
        })
    }
    if (callback) callback();
};

const commitTx = (callback) => {
    return actionTx(() => connection.commit(actionTx(callback)));
};

// connection.end();

module.exports = {
    getAll,
    getActive,
    save,
    save_details,
    getFavorites,
    filterNew,
    deleteAll,
    toggleFavorite
};