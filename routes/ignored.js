const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');

router.get('/', function (req, res, next) {
    apartments_db.getIgnored().then(apartments => res.render('saved', {
        title: 'Ignored apartments',
        apartments,
        showDetails: true
    }), next)
});

router.post('/toggle', function (req, res, next) {
    const apartment = req.body;
    apartments_db.toggle_ignored(apartment).then(() => res.send('toggle ignored done'), next);
});

module.exports = router;