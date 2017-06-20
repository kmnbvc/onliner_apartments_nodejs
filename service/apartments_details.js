const client = require('flashheart').createClient({
    name: 'apartments_details',
    logger: console,
    json: false,
    retries: 10,
    retryTimeout: 1000,
    rateLimitLimit: 5,
    rateLimitInterval: 1500
});
const cheerio = require('cheerio');
const apartments_db = require('./apartments_db');


const fetch_details = (apartments) => {
    return load_details(apartments).map(result =>
        result.then(apartment => apartments_db.save_details(apartment)));
};

const load_details = (apartments) => {
    return apartments.map(apartment =>
        load_page(apartment.url)
            .then(html => cheerio.load(html))
            .then(page => parse_details(page), err => parse_error(err))
            .then(details => Object.assign(apartment, {details})));
};

const load_page = (url) => {
    return new Promise((resolve, reject) =>
        client.get(url, (err, body) => err ? reject(err) : resolve(body))
    )
};

const parse_details = (page) => {
    return {
        text: page('.apartment-info__sub-line_extended-bottom').text().trim(),
        phone: page('.apartment-info__list_phones a').text().trim(),
        //images: page('.apartment-gallery__slide').map((index, element) => element.attribs['data-thumb']).toArray()
    }
};

const parse_error = (err) => {
    if (err.statusCode === 404) {
        return {active: false};
    }
    throw err;
};

module.exports = {
    load_page,
    fetch_details
};
