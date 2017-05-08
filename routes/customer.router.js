var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');
const uuid = require('uuid/v4');


router.get('/:id*?', function (req, res) {
    if (req.params.id) {
        Customer.find({
            id: req.params.id
        }, function (err, result) {
            res.json(result);
        });
    } else {
        Customer.find(function (err, result) {
            res.json(result);
        }).sort({
            id: 1
        });
    }
});


router.post('/', function (req, res, next) {
    var customer = req.body;
    if (!customer.id) {
        customer.id = uuid();
    }
    Customer.create(customer, function (err, item) {
        res.status(200).send(customer.id);
        if (next) next();
    });
});

router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        Customer.remove({
            id: id
        }, function (err, result) {
            if (err)
                res.send(err);
            else {
                res.status(200).send();
                if (next) next();
            }
        });
    }
});

router.put('/:id', function (req, res, next) {
    var customer = req.body;
    var id = req.params.id;
    Customer.update({
        id: id
    }, customer, function (err, result) {
        res.status(200).send();
        if (next) next();
    });
});

module.exports = router;