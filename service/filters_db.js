const db = require('./db');

const getAll = () => {
    return db.query('SELECT * FROM filters');
};

const get = (name) => {
    return db.query('SELECT * FROM filters WHERE name = ?', name).then(filters => filters[0]);
};

const create = (filter) => {
    return db.query('INSERT INTO filters SET ?', filter);
};

const remove = (name) => {
    return db.query('DELETE FROM filters WHERE name = ?', name);
};


module.exports = {
    getAll,
    create,
    remove,
    get
};
