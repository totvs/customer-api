var logger = require('./../lib/logger');
var Mongoose = require('mongoose');
var moment = require('moment');
var customerSchema = new Mongoose.Schema({
    id: String,
    name: String,
    address: String,
    dateOfbirth: Date,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    active: Boolean    
});

customerSchema.pre('save', function(next) {
    this.created_at = new Date().toISOString();
    next();
});

customerSchema.pre('update', function(next) {
    this.updated_at = new Date().toISOString();
    next();
});

var Customer = Mongoose.model('Customer', customerSchema);

module.exports = Customer;
