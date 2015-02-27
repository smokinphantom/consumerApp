/**
 * New node file
 */
var schema = require('./schema_account_details');

var _statusCodes = {
	success : 200,
	badRequest: 400,
	unknown: 500
};


var _errPhone = {
		status: _statusCodes.badRequest,
		msg: "Please enter a valid phone number"
};
var _errPassword = {
		status: _statusCodes.badRequest,
		msg: "Password must be atleast 8 characters " +
		"long and should contain a number"
};
	
var _errEmail = {
		status: _statusCodes.badRequest,
		msg: "Please enter a valid email"
};

var _errUsernameUnavailable = {
		status: _statusCodes.badRequest,
		msg:"Username is already taken"
};

var _errUsernameInvalid = {
		status: _statusCodes.badRequest,
		msg:"Username must be atleast 6 characters in length with no special characters"
};

var _errUnknown = { 
		status: _statusCodes.unknown,
		msg: "Unknown error"
};
var _msgSuccess = {
		status: _statusCodes.success,
		msg: "Yo"
};

var _msgCustom = {
		status : null,
		msg: null
};


var isPasswordValid = function(password){
    var returnValue = false;
    if(password.length >=8 ){
	var pattern = /[a-zA-Z][0-9]|[0-9][a-zA-Z]/;
	    returnValue = pattern.test(password);
    }
	return returnValue;
};


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

var isUserNameValid = function(username){
	var returnValue = false;
    if(username.length >=6 ){
	var pattern = /^[\w{.,}+:?®©-]+$/;
	    returnValue = pattern.test(username);
    }
	return returnValue;

};

var createSchema = function(username,password, email, phone){
	var record = new schema({
				username : username,
				password : password,
				email: email,
				phone : phone
	});
	return record;
};

var writeResponse = function(response, message){
	response.status(message.status);
	response.json(message.msg);
};

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

var isEmailValid = function(email){
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

var isPhoneValid = function(phone){
	var returnValue = false;
    if(phone.length === 10 ){
    	var pattern = /^[0-9]*$/;
	    returnValue = pattern.test(phone);
    }
	return returnValue;

};

exports.signup = function(request, response){
	
	var username =  request.body.username;
	var password =  request.body.password;
	var email = request.body.email;
	var phone = request.body.phone;
	var address =  request.body.address;
	console.log(request);

	var synchronousCallback = function(isValid){
		if(isValid){
			if(isPasswordValid(password)){
				if(isEmailValid(email)){
					if(isPhoneValid(phone)){
						saveRecord(response, username, password, email, phone);
					}
					else{
						writeResponse(response, _errPhone );
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

