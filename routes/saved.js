const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function(req, res, next) {
    apartments_db.getAll()
        .then((apartments) => res.render('saved', {title: 'Previous apartments', apartments}))
});

router.get('/delete', function (req, res, next) {
    apartments_db.deleteAll().then(() => res.redirect(req.baseUrl))
});

module.exports = router;