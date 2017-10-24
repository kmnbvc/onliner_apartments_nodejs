const db = require('./db');
const apartments_model = require('../model/apartments');

const getAll = () => {
    return db.query('SELECT * FROM apartments a ORDER BY a.updated DESC');
};

const getActive = () => {
    return db.query('SELECT * FROM apartments a WHERE a.active = TRUE AND a.ignored = FALSE ORDER BY a.updated DESC');
};

const getFavorites = () => {
    return db.query('SELECT * FROM apartments a WHERE a.favorite = TRUE ORDER BY a.updated DESC');
};

const getIgnored = () => {
    return db.query('SELECT * FROM apartments a WHERE a.ignored = TRUE ORDER BY a.updated DESC');
};

const search = (filter = {}) => {
    const query = 'SELECT * FROM apartments a WHERE a.ignored = FALSE ' +
        (filter.from_date ? ` AND a.updated >= ${filter.from_date}` : '') +
        (filter.active === 'ACTIVE_ONLY' ? ' AND a.active = TRUE' : '') +
        (filter.active === 'INACTIVE_ONLY' ? ' AND a.active = FALSE' : '') +
        (filter.source_name ? ` AND a.source_name = '${filter.source_name}'` : '') +
        (filter.owner === 'OWNER' ? ' AND a.owner = TRUE ' : '') +
        (filter.owner === 'NOT_OWNER' ? ' AND a.owner = FALSE ' : '') +
        ' ORDER BY a.updated DESC';

    return db.query(query);
};

const save = (apartments) => {
    return db.createTx().then(tx => tx.start(() => {
        const query = `INSERT INTO apartments (${apartments_model.fields().join(',')}) VALUES ?`;
        const params = [apartments_model.toArray(apartments)];
        tx.connection.query(query, params, tx.commit);
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

const toggle_favorite = (apartment) => {
    const fields = apartments_model.fields().join(',');
    const values = apartments_model.toArray([apartment], {favorite: true});
    return db.query(`INSERT INTO apartments (${fields}) VALUES (?) ON DUPLICATE KEY UPDATE favorite = NOT favorite`, values);
};

const toggle_ignored = (apartment) => {
    const fields = apartments_model.fields().join(',');
    const values = apartments_model.toArray([apartment], {ignored: true});
    return db.query(`INSERT INTO apartments (${fields}) VALUES (?) ON DUPLICATE KEY UPDATE ignored = NOT ignored`, values);
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
        tx.connection.query('INSERT INTO images (apartment_id, url) VALUES ? ON DUPLICATE KEY UPDATE id = id', params, tx.commit);
    }) : tx.commit;
};

module.exports = {
    getAll,
    getActive,
    getFavorites,
    getIgnored,
    search,
    save,
    save_details,
    filterNew,
    deleteAll,
    toggle_favorite,
    toggle_ignored,
    clear_favorites
};