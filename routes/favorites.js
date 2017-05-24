const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function(req, res, next) {
    apartments_db.getFavorites()
        .then((apartments) => res.render('table', {title: 'Favorites apartments', apartments}));
});


module.exports = router;