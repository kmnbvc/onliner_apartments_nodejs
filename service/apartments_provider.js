const mysql = require('mysql');
const request = require('request');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'onliner_apartments',
    user: 'root',
    password: 'root'
});

connection.connect();

const getSources = () => {
    return query("SELECT * FROM sources");
};

const update = (source) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            connection.query('UPDATE sources SET ? WHERE name = ?', [source, source.name],
                rollbackOnError(() => connection.commit(rollbackOnError(resolve))));
        })
    );
};

const remove = (name) => {
    return new Promise((resolve, reject) =>
        connection.beginTransaction(error => {
            if (error) throw error;

            connection.query('DELETE FROM sources WHERE name = ?', [name],
                rollbackOnError(() => connection.commit(rollbackOnError(resolve))));
        })
    );
};

const getActiveUrls = () => {
    return query('SELECT s.url FROM sources s WHERE s.active = TRUE');
};

const loadApartments = () => {
    return getActiveUrls().then(urls => Promise.all(urls.map(url => loadAllPages(url))).then(values => resolve([].concat(...values))));
};

const loadAllPages = (url) => {
    return new Promise((resolve, reject) =>
        loadPage(url, 1).then((data) => {
            const total_pages = data.page.last;
            const results = [data.apartments];

            for (let page = 2; page <= total_pages; page++) {
                results.push(loadPage(url, page, (data) => data.apartments));
            }

            Promise.all(results).then(values => resolve([].concat(...values)));
        })
    );
};

const loadPage = (url, page, mapper = (data) => data) => {
    url = url.replace('page=1', 'page=' + page);
    const headers = {'Accept': 'application/json'};

    return new Promise((resolve, reject) =>
        request({url, headers}, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(mapper(JSON.parse(body)));
            } else {
                reject(error || `Response status code is ${response.statusCode}. Something went wrong.`)
            }
        })
    );
};

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (err, rows, fields) {
            if (err) reject(err);
            resolve(rows);
        })
    })
};

const rollbackOnError = (callback) => (error) => {
    if (error) {
        return connection.rollback(() => {
            throw error;
        })
    }
    if (callback) callback();
};

module.exports = {
    getSources,
    loadApartments,
    update,
    remove
};
