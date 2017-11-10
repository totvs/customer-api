var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');
const uuid = require('uuid/v4');


/**
 * @apiVersion 0.1.0
 * @api {get} costumer/:id Find a costumer
 * @apiGroup Costumer
 * @apiParam {id} id Costumer id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "Nelson",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989",
 *      "created_at": "Fri Nov 10 2017 18:24:08 GMT-0200 (-02)"
 *      "updated_at": "Fri Nov 12 2017 13:35:49 GMT-0200 (-02)"
 *    }
 * @apiErrorExample {json} Costumer not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:id*?', function (req, res) {
    console.log("params: ", req.query);
    if (req.params.id) {
        Customer.find({
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
        var query = Customer.find(mongoFilterObj);
        Customer.count(mongoFilterObj, function (err, totalCount) {
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

/**
 * @apiVersion 0.1.0
 * @api {post} costumer/ Register a new costumer
 * @apiGroup Costumer
 * @apiParam {Number} id Costumer id
 * @apiParam {String} name Costumer name
 * @apiParam {String} address Costumer address
 * @apiParam {String} dateOfbirth Costumer dateOfbirth
 * @apiParamExample {json} Input
 *    {
 *      "name": "Study",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": as4s4f5wh548h9,
 *      "name": "Study",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989",
 *      "created_at": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),
 *      "active": true
 *    }
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post('/', function (req, res, next) {
    var customer = req.body;
    if (!customer.id) {
        customer.id = uuid();
    }
    Customer.create(customer, function (err, item) {
        res.status(200).send(item);
        if (next) next();
    });
});

/**
 * @apiVersion 0.1.0
 * @api {delete} costumer/:id Remove a costumer
 * @apiGroup Costumer
 * @apiParam {id} id Costumer id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
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