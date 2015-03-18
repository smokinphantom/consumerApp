 /**
 * Import schema for the nosql table(account_details)
 */
var auth = require('../../auth/auth.service');
var schema = require('../schema/account_details');
var cryptoJS = require('crypto-js');
/**
 * Import HTTP response codes to construct response messages for the client
 */
var _statusCodes = require('../http_constants/http_response_codes');
	_statusCodes = new _statusCodes();

 /**
 * Import constants - response strings are stored in constants.js
 */

var _constants = require('./constants');
	_constants = new _constants();

 /**
 * Template for success and failure response
 */

var template = function(status, message){
	var temp = {}
	temp.status = status;
	temp.msg = message;
	return temp;
};

/**
 * Based on above template, construct the status message to be written in the HTTP response
 */
var _errUsernameInvalid = template(_statusCodes.badRequest,_constants._alert_invalid_username);
var _errUnknown = template(_statusCodes.unknown,_constants._alert_unknown);
var _msgSuccess = template(_statusCodes.success,_constants._alert_msgSuccess);
var _msgCustom = template(null,null);


 /**
 * Check if given username exists in the DB, if yes check if the passed in password is correct
 */

var isValidCredentials = function(user,password, callback){
	var searchCriteria = user.indexOf('@') > -1 ?   {email:user}: {username:user};
	schema.find(searchCriteria)
	.exec(function(err,data){
		if(err){
			console.log(err);
		}
		else{	console.log(data);
			/******
			*	Sample values for the returned data from the DB
			*		[ { _id: 54f338a63d279adc1b7e95b7,
    		*			username: 'nameOfUser',
    		*			password: 'SomePassword89', --> password === data[0].password checks here
    		*			email: 'dsdsds@gmail.coms',
    		*			phone: 1234567891,
    		*			salt: '13697.757851332426'
    		*		__v: 0 } ]
			******/
			callback(data.length !== 0 && cryptoJS.SHA256(data[0].salt+password).toString() === data[0].password);
		}
	});	
};

/**
 * Writes the message to the HTTP response.
 * Message is of type Template
 */

var writeResponse = function(response, message, token, request, username){
	if(request && username){
		request.session.username = username;
	}
	response.status(message.status);
	if(token){
		response.json(token);
	}
	else{
		response.json(message.msg);
	}
};

/**
 * Public API that is exposed to the front end
 */
exports.login = function(request, response){
	var username =  (request.body.username).toLowerCase();
	var password =  request.body.password;
	var token = {};
	if(request.session.username &&  request.session.username === username){
		response.json("Already logged in");
	}
	else{
		var synchronousCallback = function(boolean){
			if(boolean){
				token.id = auth.signToken(username);
				token.user = username;
				writeResponse(response,_msgSuccess, token, request, username);
			}
			else{
				writeResponse(response, _errUsernameInvalid);
			}
		}
		isValidCredentials(username, password, synchronousCallback);
	}
};

exports.getUserName = function(request, response){
	if(request.session.username){
		response.status(200);
		response.json(request.session.username);
	}
	else{
		response.status(400);
		response.json("Please login first");
	}
};