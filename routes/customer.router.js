var express = require('express');
var logger = require('./../lib/logger');
var router = express.Router();
var Customer = require('../models/customer.model.js');
const uuid = require('uuid/v4');

/**
 * @apiVersion 0.1.0
 * @api {get} customers/ Find all customers
 * @apiGroup Customer
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": "46a78718-4603-4f64-88d6-db6eb6db2071",
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008",
 *      "createdAt": "Fri Nov 10 2017 18:24:08 GMT-0200 (-02)",
 *      "updatedAt": "Fri Nov 12 2017 13:35:49 GMT-0200 (-02)",
 *      "deleted": false
 *    }
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
 * @api {get} customers/diff/:date Find the customers modified after a date
 * @apiGroup Customer
 * @apiParam {date} date a date reference
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": "46a78718-4603-4f64-88d6-db6eb6db2071",
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008",
 *      "createdAt": "Fri Nov 10 2017 18:24:08 GMT-0200 (-02)",
 *      "updatedAt": "Fri Nov 12 2017 13:35:49 GMT-0200 (-02)",
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
            res.json({
                hasNext: page < pages,
                items: result ? result : []
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
 * @api {post} customers/ Register a new customer
 * @apiGroup Customer
 * @apiParam {Number} id customer id
 * @apiParam {String} name customer name
 * @apiParam {String} address customer address
 * @apiParam {String} dateOfbirth customer dateOfbirth
 * @apiParamExample {json} Input
 *    {
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": "46a78718-4603-4f64-88d6-db6eb6db2071",
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008",
 *      "createdAt": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),
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
 * @api {delete} customers/:id Delete softly a customer
 * @apiGroup Customer
 * @apiParam {id} id customer id
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
 * @api {delete} customers/remove/:id Remove a customer
 * @apiGroup Customer
 * @apiParam {id} id customer id
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
 * @api {put} customers/ Edit a customer
 * @apiGroup Customer
 * @apiParam {Number} id customer id
 * @apiParam {String} name customer name
 * @apiParam {String} address customer address
 * @apiParam {String} dateOfbirth customer dateOfbirth
 * @apiParamExample {json} Input
 *    {
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008"
 *    }
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 46a78718-4603-4f64-88d6-db6eb6db2071,
 *      "name": "Jade",
 *      "address": "221B Baker Street",
 *      "dateOfbirth": "12/29/2008",
 *      "createdAt": Fri Nov 10 2017 18:24:08 GMT-0200 (-02),
 *      "updatedAt": Fri Nov 12 2017 13:35:49 GMT-0200 (-02),
 *      "deleted": false
 *    }
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