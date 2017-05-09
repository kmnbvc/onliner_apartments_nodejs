const express = require('express');
const router = express.Router();
const apartments_service = require('../service/apartments_service');


router.get('/', function(req, res, next) {
    apartments_service.getFavorites()
        .then((apartments) => res.render('index', {title: 'Favorites apartments', apartments}));
});


module.exports = router;