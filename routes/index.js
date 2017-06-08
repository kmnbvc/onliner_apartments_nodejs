const express = require('express');
const router = express.Router();
const apartments_loader = require('../service/apartments_loader');
const apartments_model = require('../model/apartments');
const apartments_db = require('../service/apartments_db');


router.get('/', function (req, res, next) {
    apartments_loader.loadApartments()
        .then(apartments => apartments_db.filterNew(apartments))
        .then(apartments => res.render('index', {
            title: `Apartments list`,
            apartments: apartments_model.get_dto_list(apartments)
        }))
});

router.get('/save', function (req, res, next) {
    const apartments = JSON.parse(req.query.apartments);
    apartments_db.save(apartments).then(result => res.redirect('/saved'));
});

module.exports = router;
