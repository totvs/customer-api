var logger = require('./../lib/logger');
var Mongoose = require('mongoose');
var userSchema = new Mongoose.Schema({
    id: String,
    name: String,
    login: String
});

var User = Mongoose.model('User', userSchema);

module.exports = User;
