const parser = function () {
    return function (req, res, next) {
        if (req.body) {
            req.body = parse(req.body);
        } else {
            console.log('body-values-parser: req.body is empty', req);
        }
        next();
    };
};

const parse = (obj) => {
    const result = {};

    for (let [key, value] of entries(obj)) {
        if (value === 'true') {
            result[key] = true;
        } else if (value === 'false') {
            result[key] = false;
        } else if (value.constructor === Object) {
            result[key] = parse(value);
        } else {
            result[key] = value;
        }
    }

    return result;
};

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

module.exports = parser;