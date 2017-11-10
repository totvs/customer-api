var logger = require('./../lib/logger');
var Mongoose = require('mongoose');
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

// customerSchema.pre('save', (doc, next) => {
//     this.created_at = new Date();
//     next();
// });

var Customer = Mongoose.model('Customer', customerSchema);

module.exports = Customer;
