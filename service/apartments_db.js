const db = require('./db');
const apartments_model = require('../model/apartments');
const moment = require('moment');

const getAll = () => {
    return db.query('SELECT * FROM apartments ORDER BY updated DESC');
};

const getActive = () => {
    return db.query('SELECT * FROM apartments a WHERE a.active = TRUE ORDER BY a.updated DESC');
};

const getFavorites = () => {
    return db.query('SELECT * FROM apartments a WHERE a.favorite = TRUE');
};

const search = (filter) => {
    const query = 'SELECT * FROM apartments a WHERE 1=1 ' +
        (filter.from_date ? ` AND a.updated >= ${filter.from_date}` : '') +
        (filter.active === 'ACTIVE_ONLY' ? ' AND a.active = TRUE' : '') +
        (filter.active === 'INACTIVE_ONLY' ? ' AND a.active = FALSE' : '') +
        ' ORDER BY a.updated DESC';

    return db.query(query);
};

const save = (apartments) => {
    return db.createTx().then(tx => tx.start((resolve, reject) => {
        const ids = apartments_model.ids(apartments);
        tx.connection.query('DELETE FROM apartments WHERE id IN (?)', [ids], tx.action(() => {
            const query = `INSERT INTO apartments (${apartments_model.fields().join(',')}) VALUES ?`;
            const params = [apartments_model.toArray(apartments)];
            tx.connection.query(query, params, tx.commit(resolve));
        }))
    }))
};

const filterNew = (apartments) => {
    return getAll().then(existed => {
        const existed_ids = apartments_model.ids(existed);
        return apartments.filter(a => !existed_ids.includes(a.id));
    })
};

const deleteAll = () => {
    return db.query('DELETE FROM apartments');
};

const toggleFavorite = (apartment) => {
    apartment.favorite = !apartment.favorite;
    return save([apartment]);
};

const save_details = (apartment) => {
    const {id, details} = apartment;
    const images = details.images || [];
    delete details.images;

    return db.createTx().then(tx => tx.start((resolve, reject) =>
        tx.connection.query('UPDATE apartments SET ? WHERE id = ?', [details, id],
            (images.length > 0) ? save_images(id, images, tx, resolve) : tx.commit(resolve))));
};

const save_images = (id, images = [], tx, resolve) => {
    return tx.action(() =>
        tx.connection.query('DELETE FROM images WHERE apartment_id = ?', [id], tx.action(() => {
            const query = 'INSERT INTO images (apartment_id, url) VALUES ?';
            const params = [images.map(img => [id, img])];
            tx.connection.query(query, params, tx.commit(resolve));
        }))
    )
};

module.exports = {
    getAll,
    getActive,
    search,
    save,
    save_details,
    getFavorites,
    filterNew,
    deleteAll,
    toggleFavorite
};