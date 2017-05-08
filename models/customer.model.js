var logger = require('./../lib/logger');
var Mongoose = require('mongoose');
var customerSchema = new Mongoose.Schema({
    id: Number,
    name: String,
    address: String,
    dateOfbirth: Date    
});

var Customer = Mongoose.model('Customer', customerSchema);

module.exports = Customer;
