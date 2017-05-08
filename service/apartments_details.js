const request = require('request');

const load_page = (url) => {
    return new Promise((resolve, reject) => {
        request({url, headers: {'Accept': 'application/json'}}, function (error, response, body) {
            if (error) reject(error);
            resolve(body)
        });
    })
};

const load_text = (url) => {
    load_page(url).then(page => console.log(page));
};

module.exports = {
    load_page,
    load_text
};
