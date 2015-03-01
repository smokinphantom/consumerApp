/**
 * New node file
 */

 /**
 * Import schema for the nosql table
 */
var schema = require('./schema');

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
}
 
 /**
 * Based on above template, construct the status message to be written in the HTTP response
 */

var _errPhone = template(_statusCodes.badRequest,_constants._alert_invalid_phone);
var _errPassword = template(_statusCodes.badRequest,_constants._alert_invalid_password);
var _errEmail = template(_statusCodes.badRequest,_constants._alert_invalid_email);
var _errUsernameUnavailable = template(_statusCodes.badRequest,_constants._alert_username_taken);
var _errUsernameInvalid = template(_statusCodes.badRequest,_constants._alert_invalid_username);
var _errUnknown = template(_statusCodes.unknown,_constants._alert_unknown);
var _msgSuccess = template(_statusCodes.success,_constants._alert_msgSuccess);
var _msgCustom = template(null,null);

 /**
 * Check if the username is already picked by someoneelse. Query the nosql DB to find this
 */

var isUserNameAvailable = function(username, callback){
	schema.find({ username: username })
	.exec(function(err,data){
		if(err){
			console.log(err);
		}
		else{	
			callback(data.length === 0);
		}
	});	
};

 /**
 * Check if the given username is valid
 * Username must be atleast 6 characters in length with no special characters
 */

var isUserNameValid = function(username){
    var pattern = '[^!@#$%^&*();:\'",<>?]{'+username.length+'}';
	var re = new RegExp(pattern,'');
	return username.length>5 && re.test(username) ;
};

/**
 * Check if the given password is valid
 * Password must be atleast 8 characters long and should contain atleast one number
 */

var isPasswordValid = function(password){
    var pattern = '[0-9]';
	var re = new RegExp(pattern,'');
	return password.length>5 && re.test(password) ;
};

/**
 * Check if the given email is valid
 * Checks for @ in the string
 */
var isEmailValid = function(email){
    var pattern = '[@]';
	var re = new RegExp(pattern,'g');
	return re.test(email);
};

/**
 * Check if the given phone number is valid
 * Length = 10, all numbers
 */

var isPhoneValid = function(phone){
    var pattern = '[0-9]{'+phone.length+'}';
	var re = new RegExp(pattern,'g');
	return phone.length === 10 && re.test(phone);

};

/**
 * Create a record based on the schema that can be written to the nosql DB
 */

var createSchema = function(username,password, email, phone){
	var record = new schema({
				username : username,
				password : password,
				email: email,
				phone : phone
	});
	return record;
};

/**
 * Writes the message to the HTTP response.
 * Message is of type Template
 */

var writeResponse = function(response, message){
	response.status(message.status);
	response.json(message.msg);
};

/**
 * Save the user details obtained from form to the nosql DB
 */

var saveRecord = function(response, username, password, email, phone){
	var record = createSchema(username,password, email, phone);
	record.save(function(err){
		if(err){
			writeResponse(response,_errUnknown);
		}
		else{
			writeResponse(response,_msgSuccess);
		}
	});
};

/**
 * Public API that is exposed to the front end
 */
exports.signup = function(request, response){
	
	var username =  request.body.username;
	var password =  request.body.password;
	var email = request.body.email;
	var phone = request.body.phone;
	var address =  request.body.address;

	console.log(username);


	var synchronousCallback = function(isValid){
		if(isValid){
			if(isPasswordValid(password)){
				if(isEmailValid(email)){
					if(isPhoneValid(phone)){
						saveRecord(response, username, password, email, phone);
					}
					else{
						writeResponse(response,_errPhone);
					}
				}
				else{
					writeResponse(response, _errEmail );
				}
			}
			else{
				writeResponse(response, _errPassword );
			}
		}else{
			writeResponse(response, _errUsernameUnavailable);
		}
	};
	
	if(isUserNameValid(username)){
		isUserNameAvailable(username, synchronousCallback);
	}
	else{
		writeResponse(response, _errUsernameInvalid);
	}
		
	

};
/**
 * Dummy method for now
 */
exports.get = function(request, response){
	schema.find()
	.exec(function(err,data){
		if(err){
			writeResponse(response, _errUnknown );
		}
		else{
			_msgCustom.status=200;
			_msgCustom.msg = data;
			writeResponse(response, _msgCustom );
		}
	});
};

