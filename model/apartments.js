//


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
        address: (obj) => obj.location.address,
        type: (obj) => obj.rent_type,
    }
};

const map_field = (field, obj) => {
    return {[field]: mappers()[field](obj)};
};

const fields = () => {
    return Object.keys(mappers());
};

const toArray = (apartments) => {
    return apartments.map(ap => fields().map(field => ap[field]));
};

module.exports = {get_dto, get_dto_list, ids, fields, toArray};
