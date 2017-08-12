const client = require('flashheart').createClient({
    name: 'apartments_loader',
    logger: console,
    retries: 10,
    retryTimeout: 500,
    rateLimitLimit: 5,
    rateLimitInterval: 1000
});
const sources_db = require('./sources_db');


const loadApartments = () => {
    return sources_db.getActiveSources()
        .then(sources => concatResults(sources.map(source => loadAllPages(source))))
        .then(apartments => unique(apartments));
};

const loadAllPages = (source) => {
    return loadPage(source, 1).then(data => {
        const total_pages = data.page.last;
        const results = [extract_results(source, data)];

        for (let page = 2; page <= total_pages; page++) {
            results.push(loadPage(source, page, extract_results));
        }

        return concatResults(results);
    });
};

const loadPage = (source, page, mapper = (source, data) => data) => {
    const current_page = source.url.replace('page=1', 'page=' + page);

    return new Promise((resolve, reject) =>
        client.get(current_page, (err, body) => err ? reject(err) : resolve(mapper(source, body)))
    );
};

const extract_results = (source, data) => {
    const apartments = data.apartments;
    return apartments.map(ap => Object.assign(ap, {source}));
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
