const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function (req, res, next) {
    apartments_db.getFavorites()
        .then(apartments => res.render('favorites', {title: 'Favorites apartments', apartments, showDetails: true}), next);
});

router.post('/toggle', function (req, res, next) {
    const apartment = req.body;
    apartments_db.toggleFavorite(apartment).then(() => res.send('add favorite'), next);
});

router.get('/clear_all', function (req, res, next) {
    apartments_db.clear_favorites(false).then(() => res.redirect(req.baseUrl), next);
});

router.get('/clear_inactive', function (req, res, next) {
    apartments_db.clear_favorites().then(() => res.redirect(req.baseUrl), next);
});

module.exports = router;