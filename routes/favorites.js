const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function (req, res, next) {
    apartments_db.getFavorites()
        .then((apartments) => res.render('table', {title: 'Favorites apartments', apartments, showDetails: true}), next);
});


router.post('/add', function (req, res, next) {
    const apartment = req.body;
    apartments_db.toggleFavorite(apartment).then(() => res.send('add favorite'), next);
});

module.exports = router;