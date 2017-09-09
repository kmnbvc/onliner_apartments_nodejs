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
    const id = req.body.id;
    apartments_db.toggle_ignored(id).then(() => res.send('toggle ignored done'), next);
});

module.exports = router;