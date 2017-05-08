const express = require('express');
const router = express.Router();
const apartments_service = require('../service/apartments_service');
const apartments_model = require('../model/apartments');


router.get('/', function(req, res, next) {


    res.render('index', {title: 'New apartments', apartments: {}})
});



module.exports = router;