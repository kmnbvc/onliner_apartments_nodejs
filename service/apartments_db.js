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
    return db.query('SELECT * FROM apartments a WHERE a.favorite = TRUE ORDER BY a.updated DESC');
};

const search = (filter) => {
    const query = 'SELECT * FROM apartments a WHERE 1=1 ' +
        (filter.from_date ? ` AND a.updated >= ${filter.from_date}` : '') +
        (filter.active === 'ACTIVE_ONLY' ? ' AND a.active = TRUE' : '') +
        (filter.active === 'INACTIVE_ONLY' ? ' AND a.active = FALSE' : '') +
        (filter.source_name ? ` AND a.source_name = '${filter.source_name}'` : '') +
        ' ORDER BY a.updated DESC';

    return db.query(query);
};

const save = (apartments) => {
    return db.createTx().then(tx => tx.start(() => {
        const ids = apartments_model.ids(apartments);
        tx.connection.query('DELETE FROM apartments WHERE id IN (?)', [ids], tx.action(() => {
            const query = `INSERT INTO apartments (${apartments_model.fields().join(',')}) VALUES ?`;
            const params = [apartments_model.toArray(apartments)];
            tx.connection.query(query, params, tx.commit);
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

const clear_favorites = (only_inactive = true) => {
    const query = 'UPDATE apartments SET favorite = FALSE WHERE favorite = TRUE ' +
        (only_inactive ? 'AND active = FALSE ' : '');
    return db.query(query);
};

const save_details = (apartment) => {
    const {id, details} = apartment;
    const images = details.images;
    delete details.images;

    return db.createTx().then(tx => tx.start(() =>
        tx.connection.query('UPDATE apartments SET ? WHERE id = ?', [details, id], save_images(id, images, tx))));
};

const save_images = (id, images = [], tx) => {
    return (images.length > 0) ? tx.action(() => {
        const params = [images.map(img => [id, img])];
        tx.connection.query('REPLACE INTO images (apartment_id, url) VALUES ?', params, tx.commit);
    }) : tx.commit;
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
    toggleFavorite,
    clear_favorites
};