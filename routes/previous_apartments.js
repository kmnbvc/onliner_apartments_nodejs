const express = require('express');
const router = express.Router();
const apartments_service = require('../service/apartments_service');


router.get('/', function(req, res, next) {
    apartments_service.getAll()
        .then((apartments) => res.render('index', {title: 'Previous apartments', apartments}))
});


module.exports = router;