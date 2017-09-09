const express = require('express');
const router = express.Router();
const apartments_db = require('../service/apartments_db');


router.get('/', function (req, res, next) {
    apartments_db.getFavorites()
        .then(apartments => res.render('favorites', {
            title: 'Favorite apartments',
            apartments,
            showDetails: true
        }), next);
});

router.post('/toggle', function (req, res, next) {
    const id = req.body.id;
    apartments_db.toggle_favorite(id).then(() => res.send('toggle favorite done'), next);
});

router.get('/clear_all', function (req, res, next) {
    apartments_db.clear_favorites(false).then(() => res.redirect(req.baseUrl), next);
});

router.get('/clear_inactive', function (req, res, next) {
    apartments_db.clear_favorites().then(() => res.redirect(req.baseUrl), next);
});

module.exports = router;