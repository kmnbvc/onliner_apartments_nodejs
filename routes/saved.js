const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');
const apartment_details = require('../service/apartments_details');
const sse = require('../middleware/sse');

router.get('/', function (req, res, next) {
    apartments_db.getAll()
        .then(apartments => res.render('saved', {title: 'Previous apartments', apartments}), next)
});

router.get('/delete', function (req, res, next) {
    apartments_db.deleteAll().then(() => res.redirect(req.baseUrl), next)
});

router.get('/load_details', sse, function (req, res, next) {
    apartments_db.getActive()
        .then(apartments => apartment_details.fetch_details(apartments))
        .then(results => {
            res.sse(`data: ${results.length}\n\n`, 'total');
            const q = results.map(result => result.then(query => res.sse('data: done\n\n'), (err) => res.sse(`data: ${err}\n\n`, 'error')));
            return Promise.all(q).then(() => {
                res.sse('data: finish\n\n', 'finish');
                res.end();
            });
        });
});

module.exports = router;