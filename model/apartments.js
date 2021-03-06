const moment = require('moment-timezone');


const get_dto = (obj) => {
    return Object.assign.apply({}, fields().map(field => map_field(field, obj)));
};

const get_dto_list = (objs) => {
    return objs.map(obj => get_dto(obj))
};

const ids = (objs) => {
    return objs.map(obj => obj.id)
};

const mappers = () => {
    return {
        id: (obj) => obj.id,
        url: (obj) => obj.url,
        price: (obj) => obj.price.amount,
        currency: (obj) => obj.price.currency,
        address: (obj) => obj.location.address || obj.location.user_address,
        type: (obj) => obj.rent_type,
        updated: (obj) => moment.tz(obj.last_time_up, 'UTC').format('YYYY-MM-DD HH:mm:ss'),
        photo_url: (obj) => obj.photo,
        active: (obj) => true,
        favorite: (obj) => false,
        source_name: (obj) => obj.source.name,
        text: (obj) => obj.text,
        ignored: (obj) => false,
        owner: (obj) => obj.contact.owner
    }
};

const map_field = (field, obj) => {
    return {[field]: mappers()[field](obj)};
};

const fields = () => {
    return Object.keys(mappers());
};

const toArray = (apartments, custom_values = {}) => {
    return apartments.map(ap => fields().map(field => custom_values[field] || ap[field]));
};

module.exports = {get_dto, get_dto_list, ids, fields, toArray};
