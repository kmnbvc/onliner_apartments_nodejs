const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');
const filters_db = require('../service/filters_db');
const apartment_details = require('../service/apartments_details');
const sse = require('../middleware/sse');

router.get('/', function (req, res, next) {
    apartments_db.search()
        .then(apartments => res.render('saved', {title: 'All apartments', apartments, showDetails: true}), next)
});

router.get('/active', function (req, res, next) {
    apartments_db.getActive()
        .then(apartments => res.render('saved', {title: 'Active apartments', apartments, showDetails: true}), next)
});

router.get('/filter/:filter', function (req, res, next) {
    const filter_name = req.params.filter;
    filters_db.get(filter_name)
        .then(filter => apartments_db.search(filter))
        .then(apartments => res.render('saved', {title: `${filter_name} apartments`, apartments, showDetails: true}), next)
});

router.get('/delete', function (req, res, next) {
    apartments_db.deleteAll().then(() => res.redirect(req.baseUrl), next)
});

router.get('/load_details', sse, function (req, res, next) {
    apartments_db.getActive()
        .then(apartments => apartment_details.fetch_details(apartments))
        .then(results => {
            res.sse(`data: ${results.length}\n\n`, 'total');
            const q = results.map(result => result.then(query => res.sse('data: done\n\n'), err => res.sse(`data: ${err.code}: ${err.message}\n\n`, 'error')));
            return Promise.all(q).then(() => {
                res.sse('data: finish\n\n', 'finish');
                res.end();
            });
        });
});

module.exports = router;