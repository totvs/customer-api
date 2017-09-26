var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var User = require('../models/user.model.js');
const uuid = require('uuid/v4');


router.get('/:id*?', function (req, res) {
    console.log("params: ", req.query);
    if (req.params.id) {
        User.find({
            id: req.params.id
        }, function (err, result) {
            res.json(result);
        });
    } else {

        var reservedWords = ['order', 'page', 'pageSize'];

        var reqParams = req.query;

        //order, page, pageSize
        var page = parseInt(reqParams.page) || 1;
        var pageSize = parseInt(reqParams.pageSize) || 20;

        //FILTERS
        var objectKeys = Object.getOwnPropertyNames(reqParams);
        var mongoFilterObj = {};
        objectKeys.forEach(function (el) {
            if (reservedWords.indexOf(el) == -1) {
                mongoFilterObj[el] = reqParams[el];
            }
        });
        var query = User.find(mongoFilterObj);
        User.count(mongoFilterObj, function (err, totalCount) {
            console.log("Count total: ", totalCount);
            var pages = Math.ceil(totalCount / pageSize);
            console.log("Count total: ", totalCount);
            console.log("Pages: ", pages);
            //ORDER
            if (reqParams.order) {
                var mongoOrderObj = {};
                var orders = reqParams.order.split(",");
                orders.forEach(function (el) {
                    mongoOrderObj[el.startsWith("-") ? el.substr(1) : el] = el.startsWith("-") ? -1 : 1;
                });
                query.sort(mongoOrderObj);
            }
            query.limit(pageSize);
            query.skip(pageSize * (page - 1));
            query.exec(
                function (err, result) {
                    res.json({
                        hasNext: page < pages, //ou false
                        items: result
                    });
                }
            );

        });
    }
});


router.post('/', function (req, res, next) {
    var user = req.body;
    if (!user.id) {
        user.id = uuid();
    }
    User.create(user, function (err, item) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(user.id);

        if (next) next();
    });
});

router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        User.remove({
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
    var user = req.body;
    var id = req.params.id;
    User.update({
        id: id
    }, user, function (err, result) {
        res.status(200).send();
        if (next) next();
    });
});

module.exports = router;