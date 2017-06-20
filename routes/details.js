const express = require('express');
const apartment_details = require('../service/apartments_details');
const router = express.Router();

router.get('/', function (req, res, next) {
    // const url = req.query.target;
    // apartment_details.load_page(url).then(page => res.send(page), next);


    const url = 'https://r.onliner.by/ak/apartments/237529';
    const apartments = [{id: 237529, url}];
    Promise.all(apartment_details.fetch_details(apartments)).then(values => res.send(values), next);

});

module.exports = router;
