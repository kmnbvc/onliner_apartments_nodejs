const client = require('flashheart').createClient({
    name: 'apartments_loader',
    logger: console,
    retries: 5,
    retryTimeout: 500,
    rateLimitLimit: 5,
    rateLimitInterval: 1000
});
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

    return new Promise((resolve, reject) =>
        client.get(current_page, (err, body) => err ? reject(err) : resolve(mapper(body)))
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
