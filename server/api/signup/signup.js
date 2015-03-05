 /**
 * Import schema for the nosql table(account_details)
 */
var schema = require('../schema/account_details');

 /**
 * Import HTTP response codes to construct response messages for the client
 */

var statusCodes = require('../http_constants/http_response_codes');
	statusCodes = new statusCodes();

 /**
 * Import constants - response strings are stored in constants.js
 */

var constants = require('./constants');
	constants = new constants();


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
 * Check if the given email is already registered
 */
var isEmailTaken = function(email, callback){
	schema.find({ email: email})
	.exec(function(err,data){
		if(err){
			console.log(err);
		}
		else{	
			callback(data.length !== 0);
		}
	});	
}

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

var createSchema = function(username,password, email, phone, salt){
	var record = new schema({
				username : username,
				password : password,
				email: email,
				phone : phone,
				salt: salt
	});
	return record;
};

/**
 * Writes the message to the HTTP response.
 * Message is of type Template
 */

var writeResponse = function(msg, response){
//	response.status(message.status);
	response.json(msg);
};

/**
 * Writes the message to the HTTP response.
 * Message is of type Template
 */

var addResponse = function(fieldName, response, message){
	response.msg[fieldName] = message;
	return response;
};
/**
 * Save the user details obtained from form to the nosql DB
 */

var saveRecord = function(callback, username, password, email, phone, salt){
	var record = createSchema(username,password, email, phone, salt);
	record.save(callback);
};

/**
 * Public API that is exposed to the front end
 */
exports.signup = function(request, response){
	
	var username =  request.body.username;
	var password =  request.body.password;
	var email = request.body.email;
	var phone = request.body.phone;
	var salt = request.body.salt;
	var address =  request.body.address;

	var res = {};
	res.status = 200; 
	res.msg = {}
	
	var userNameValid_callback = function(isValid){
		if(!isValid){
			res.status = statusCodes.badRequest;
			res = addResponse("username", res, constants._alert_username_taken);
			writeResponse(res, response);
		}else {
			if(!isPasswordValid(password)){
				res.status = statusCodes.badRequest;
				res = addResponse("password", res, constants._alert_invalid_password );
			}
			if(!isPhoneValid(phone)){
				res.status = statusCodes.badRequest;
				res = addResponse("phone", res, constants._alert_invalid_phone);
			}
			if(!isEmailValid(email)){
				res.status = statusCodes.badRequest;
				res = addResponse("email",res, constants._alert_invalid_email );
			}
			
			var emailTaken_callback = function(isEmailTaken){
				if(!isEmailTaken){
					if(res.status == 200){
						var saveRecord_callback = function(err){
							if(err){
								res.status = statusCodes.unknown;
								res = addResponse("signup", res,constants._alert_unknown);
							}
							else{
								res.status = statusCodes.success;
								res = addResponse("signup", res, constants._alert_msgSuccess);
							}
							writeResponse(res, response);
						};
					
						saveRecord(saveRecord_callback, username, password, email, phone, salt);
					}
					else{
						writeResponse(res, response);
					}
				}
				else{
					res.status = statusCodes.badRequest;
					res = addResponse("email",res, constants._alert_email_taken);
					writeResponse(res, response);
				}
			}
					
			isEmailTaken(email, emailTaken_callback);
		}	
	}
	if(isUserNameValid(username)){
		isUserNameAvailable(username, userNameValid_callback);
	}
	else{
		res.status = statusCodes.badRequest;
		res = addResponse("username",res, constants._alert_invalid_username);
		writeResponse(res, response);
	}
		
	

};
/**
 * Dummy method for now
 */
exports.get = function(request, response){
	schema.find()
	.exec(function(err,data){
		if(err){
			writeResponse(response, constants._alert_unknown );
		}
		else{
			_msgCustom.status=200;
			_msgCustom.msg = data;
			writeResponse(response, _msgCustom );
		}
	});
};

