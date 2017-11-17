var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');
const uuid = require('uuid/v4');



/**
 * @apiVersion 0.1.0
 * @api {get} customer/:id Find a customer
 * @apiGroup Customer
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
        findCustomer(req, res);
    }
});


/**
 * @apiVersion 0.1.0
 * @api {get} customer/diff/:date Find the customers modified after a date
 * @apiGroup Customer
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
router.get('/diff/:time', function (req, res) {
    findCustomer(req, res);
});

function findCustomer(req, res) {
    var reqParams = req.query;
    var filterObj = transformFilter(reqParams);
    Customer.count(filterObj, function (err, totalCount) {
        var query = Customer.find(filterObj);
        var page = parseInt(reqParams.page) || 1;
        var pageSize = parseInt(reqParams.pageSize) || 20;
        var pages = Math.ceil(totalCount / pageSize);
        if (reqParams.order) {
            var order = transformOrder(reqParams.order, query);
            query.sort(order);
        }
        if (req.params && req.params.time) {
            query.where('updatedAt').gt(new Date(req.params.time));
        }
        query.limit(pageSize);
        query.skip(pageSize * (page - 1));
        query.exec(function (err, result) {
            res.setHeader('Date', new Date());
            res.json({
                hasNext: page < pages,
                items: result
            });
        });
    });
}

function transformOrder(order) {
    var orderObj = {};
    var orders = order.split(",");
    orders.forEach(function (el) {
        orderObj[el.startsWith("-") ? el.substr(1) : el] = el.startsWith("-") ? -1 : 1;
    });
    return orderObj;
}

function transformFilter(reqParams) {
    var reservedWords = ['order', 'page', 'pageSize'];
    var objectKeys = Object.getOwnPropertyNames(reqParams);
    var filterObj = {};
    objectKeys.forEach(function (el) {
        if (reservedWords.indexOf(el) == -1) {
            filterObj[el] = reqParams[el];
        }
    });
    return filterObj;
}

/**
 * @apiVersion 0.1.0
 * @api {post} customer/ Register a new customer
 * @apiGroup Customer
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
        res.setHeader('Date', new Date());
        res.status(200).send(item);
        if (next) next();
    });
});

/**
 * @apiVersion 0.1.0
 * @api {delete} customer/:id Delete softly a customer
 * @apiGroup Customer
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
            res.setHeader('Date', new Date());
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
 * @apiGroup Customer
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
            res.setHeader('Date', new Date());
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
 * @apiGroup Customer
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
        res.setHeader('Date', new Date());
        res.status(200).send();
        if (next) next();
    });
});

module.exports = router;