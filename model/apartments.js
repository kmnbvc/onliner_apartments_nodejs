//


const get_dto = (obj) => {
    return {
        id: obj.id,
        url: obj.url,
        price: obj.price.amount,
        currency: obj.price.currency,
        address: obj.location.address,
        type: obj.rent_type
    }
};

const get_dto_list = (objs) => {
    return objs.map(obj => get_dto(obj))
};

const ids = (objs) => {
    return objs.map(obj => obj.id)
};

module.exports = {get_dto, get_dto_list, ids};
