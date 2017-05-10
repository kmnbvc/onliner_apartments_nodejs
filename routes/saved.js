const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function(req, res, next) {
    apartments_db.getAll()
        .then((apartments) => res.render('index', {title: 'Previous apartments', apartments}))
});


module.exports = router;