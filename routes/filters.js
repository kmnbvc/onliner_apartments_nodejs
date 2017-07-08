const express = require('express');
const router = express.Router();
const filters_db = require('../service/filters_db');
const sources_db = require('../service/sources_db');


router.get('/', function (req, res, next) {
    Promise.all([filters_db.getAll(), sources_db.getAll()])
        .then(([filters, sources]) => res.render('filters', {filters, sources}), next)
});

router.post('/add', function (req, res, next) {
    const filter = req.body;
    filters_db.create(filter).then(() => res.redirect(req.baseUrl), next);
});

router.post('/update', function (req, res, next) {
    const filter = req.body;
    filters_db.update(filter).then(() => res.redirect(req.baseUrl), next);
});

router.post('/remove', function (req, res, next) {
    const name = req.body.name;
    filters_db.remove(name).then(() => res.redirect(req.baseUrl), next);
});

module.exports = router;