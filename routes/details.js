const express = require('express');
const request = require('request');
const router = express.Router();

router.get('/', function (req, res, next) {
    const url = req.query.target;
    load_page(url).then(page => res.send(page));
});

const load_page = (url) => {
    return new Promise((resolve, reject) => {
        request({url, headers: {'Accept': 'application/json'}}, function (error, response, body) {
            if (error) reject(error);
            resolve(body)
        });
    })
};

module.exports = router;
