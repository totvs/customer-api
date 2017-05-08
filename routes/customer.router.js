var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');

router.get('/:id*?', function(req, res) {
    if(req.params.id) {
        Customer.find({ id: req.params.id }, function (err, result) {
            res.json(result);
        });
    } else {
        Customer.find(function(err, result) {
            res.json(result);
        }).sort({ id: 1});
    }
});

module.exports = router;