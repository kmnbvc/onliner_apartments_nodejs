const db = require('./db');

const getAll = () => {
    return db.query("SELECT * FROM sources ORDER BY name");
};

const getActiveSources = () => {
    return db.query('SELECT * FROM sources WHERE active = TRUE ORDER BY name');
};

const update = (source) => {
    return db.createTx().then(tx => tx.start(() =>
        tx.connection.query('UPDATE sources SET ? WHERE name = ?', [source, source.name], tx.commit)));
};

const remove = (name) => {
    return db.createTx().then(tx => tx.start(() =>
        tx.connection.query('DELETE FROM sources WHERE name = ?', [name], tx.commit)));
};

const create = (source) => {
    return db.query('INSERT INTO sources SET ?', source);
};

module.exports = {
    getAll,
    getActiveSources,
    update,
    remove,
    create
};

