/**
 * New node file
 */
var mongoose = require('mongoose');
module.exports = mongoose.model('account_details',{
	username : String,
	password : String,
	email : String,
	phone : Number,
	salt : String
});