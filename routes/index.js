const express = require('express');
const request = require('request');
const router = express.Router();
const apartments_service = require('../service/apartments_service');
const apartments_model = require('../model/apartments');


const url = "https://ak.api.onliner.by/search/apartments?rent_type%5B%5D=1_room&rent_type%5B%5D=2_rooms&price%5Bmin%5D=170&price%5Bmax%5D=300&currency=usd&only_owner=true&bounds%5Blb%5D%5Blat%5D=53.82852177626194&bounds%5Blb%5D%5Blong%5D=27.389602661132812&bounds%5Brt%5D%5Blat%5D=53.89695488571692&bounds%5Brt%5D%5Blong%5D=27.509765625000004&page=1";

router.get('/', function (req, res, next) {

    request({url: url, headers: {'Accept': 'application/json'}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            const raw_aps = data.apartments;
            const apartments = apartments_model.get_dto_list(raw_aps);
            console.log(raw_aps[0]);

            res.render('index', {
                title: 'Apartments list', apartments
            });
        }
    });

    const previous_apartments = apartments_service.getAll();


});

module.exports = router;
