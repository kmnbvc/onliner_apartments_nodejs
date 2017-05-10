const express = require('express');
const request = require('request');
const router = express.Router();
const apartments_model = require('../model/apartments');


router.get('/', function (req, res, next) {
    loadApartments().then((apartments) => res.render('index', {
        title: `Apartments list (${apartments.length} items)`, apartments: apartments_model.get_dto_list(apartments)
    }));
});

const loadApartments = () => {
    return new Promise((resolve, reject) =>
        loadPage(1).then((data) => {
            const total_pages = data.page.last;
            const results = [data.apartments];

            for (let page = 2; page <= total_pages; page++) {
                results.push(loadPage(page, (data) => data.apartments));
            }

            Promise.all(results).then(values => resolve([].concat.apply([], values)));
        })
    );
};

const _url = "https://ak.api.onliner.by/search/apartments?rent_type%5B%5D=1_room&rent_type%5B%5D=2_rooms&price%5Bmin%5D=170&price%5Bmax%5D=300&currency=usd&only_owner=true&bounds%5Blb%5D%5Blat%5D=53.82852177626194&bounds%5Blb%5D%5Blong%5D=27.389602661132812&bounds%5Brt%5D%5Blat%5D=53.89695488571692&bounds%5Brt%5D%5Blong%5D=27.509765625000004&page=1";

const loadPage = (page, mapper = (data) => data) => {
    const url = _url.replace('page=1', 'page=' + page);
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

module.exports = router;
