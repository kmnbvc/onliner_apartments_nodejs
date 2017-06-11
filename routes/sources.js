const express = require('express');
const router = express.Router();
const sources_db = require('../service/sources_db');


router.get('/', function (req, res, next) {
    sources_db.getAllSources().then(sources => res.render('sources', {sources}), next);
});

router.post('/change_state', function (req, res, next) {
    const source = req.body;
    source.active = source.active === 'true';
    sources_db.update(source).then(() => res.send('done'), next);
});

router.post('/remove', function (req, res, next) {
    const name = req.body.name;
    sources_db.remove(name).then(() => res.send('done'), next);
});

router.post('/add', function (req, res, next) {
    const source = req.body;
    sources_db.create(source).then(() => res.redirect(req.baseUrl), next);
});

module.exports = router;