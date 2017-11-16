var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');
const uuid = require('uuid/v4');



/**
 * @apiVersion 0.1.0
 * @api {get} customer/:id Find a customer
 * @apiGroup customer
 * @apiParam {id} id customer id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "Nelson",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989",
 *      "created_at": "Fri Nov 10 2017 18:24:08 GMT-0200 (-02)",
 *      "updated_at": "Fri Nov 12 2017 13:35:49 GMT-0200 (-02)",
 *      "deleted": false
 *    }
 * @apiErrorExample {json} customer not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', function (req, res) {
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
            var pages = Math.ceil(totalCount / pageSize);
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
 * @api {get} customer/diff/:date Find the customers modified or included after a date
 * @apiGroup customer
 * @apiParam {date} date a date reference
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 1,
 *      "name": "Nelson",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989",
 *      "created_at": "Fri Nov 10 2017 18:24:08 GMT-0200 (-02)",
 *      "updated_at": "Fri Nov 12 2017 13:35:49 GMT-0200 (-02)",
 *      "deleted": false
 *    }
 * @apiErrorExample {json} customer not found
 *    HTTP/1.1 404 Not Found
 * @apiErrorExample {json} Find error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/diff/:time', function(req, res){
    var time = req.params.time;
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
    
    var query = Customer.find(mongoFilterObj)
    .where('updatedAt').gt(new Date(time));

    Customer.count(mongoFilterObj, function (err, totalCount) {
        var pages = Math.ceil(totalCount / pageSize);
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
});

/**
 * @apiVersion 0.1.0
 * @api {post} customer/ Register a new customer
 * @apiGroup customer
 * @apiParam {Number} id customer id
 * @apiParam {String} name customer name
 * @apiParam {String} address customer address
 * @apiParam {String} dateOfbirth customer dateOfbirth
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
 *      "deleted": false
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
 * @api {delete} customer/:id Delete softly a customer
 * @apiGroup customer
 * @apiParam {id} id customer id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    if (id) {
        Customer.delete({
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


/**
 * @apiVersion 0.1.0
 * @api {delete} customer/remove/:id Remove a customer
 * @apiGroup customer
 * @apiParam {id} id customer id
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Delete error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete('/remove/:id', function (req, res, next) {
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

/**
 * @apiVersion 0.1.0
 * @api {put} customer/ Edit a customer
 * @apiGroup customer
 * @apiParam {Number} id customer id
 * @apiParam {String} name customer name
 * @apiParam {String} address customer address
 * @apiParam {String} dateOfbirth customer dateOfbirth
 * @apiParamExample {json} Input
 *    {
 *      "name": "Nelson",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": as4s4f5wh548h9,
 *      "name": "Nelson",
 *      "address": "Rua Emilio Castelar, 51",
 *      "dateOfbirth": "06/13/1989",
 *      "created_at": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),
 *      "updated_at": Fri Nov 12 2017 13:35:49 GMT-0200 (-02),
 *      "active": true
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 204 No Content
 * @apiErrorExample {json} Register error
 *    HTTP/1.1 500 Internal Server Error
 */
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