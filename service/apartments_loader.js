const request = require('request');
const sources_db = require('./sources_db');


const loadApartments = () => {
    return sources_db.getActiveSources()
        .then(sources => concatResults(sources.map(source => loadAllPages(source.url))))
        .then(apartments => unique(apartments));
};

const loadAllPages = (url) => {
    return loadPage(url, 1).then(data => {
        const total_pages = data.page.last;
        const results = [data.apartments];

        for (let page = 2; page <= total_pages; page++) {
            results.push(loadPage(url, page, (data) => data.apartments));
        }

        return concatResults(results);
    });
};

const loadPage = (url, page, mapper = (data) => data) => {
    const current_page = url.replace('page=1', 'page=' + page);
    const headers = {'Accept': 'application/json'};

    return new Promise((resolve, reject) =>
        request({url: current_page, headers}, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(mapper(JSON.parse(body)));
            } else {
                reject(error || `Response status code is ${response.statusCode}. Something went wrong.`)
            }
        })
    );
};

const concatResults = (results) => {
    return Promise.all(results).then(values => [].concat(...values));
};

const unique = (apartments) => {
    const seen = new Set();
    return apartments.filter(ap => seen.has(ap.id) ? false : seen.add(ap.id));
};

module.exports = {
    loadApartments
};
