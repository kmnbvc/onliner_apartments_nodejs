const express = require('express');
const router = express.Router();
const apartments_provider = require('../service/apartments_provider');


router.get('/', function (req, res, next) {
    apartments_provider.getSources().then(sources => res.render('sources', {sources}));
});


router.post('/change_state', function (req, res, next) {
    const source = req.body;
    source.active = source.active === 'true';
    apartments_provider.update(source).then(() => res.send('done'));
});

router.post('/remove', function (req, res, next) {
    const name = req.body.name;
    apartments_provider.remove(name).then(() => res.send('done'));
});

module.exports = router;