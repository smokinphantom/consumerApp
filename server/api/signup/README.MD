Sample outputs

1. exports.signup
	1.1. For invalid username
	{
	    "status": 400,
	    "msg": {
	        "username": "Username must be atleast 6 characters in length with no special characters"
	    }
	}

	1.2. Username already taken
	{
	    "status": 400,
	    "msg": {
	        "username": "Username is already taken"
	    }
	}
	
	1.3. Invalid password phone and email
	{
	    "status": 400,
	    "msg": {
	        "password": "Password must be atleast 8 characters long and should contain atleast one number",
	        "phone": "Please enter a valid phone number",
	        "email": "Please enter a valid email"
	    }
	}
	
	
	1.4. email is already registered
	{
	    "status": 400,
	    "msg": {
	        "email": "Email is already registered"
	    }
	}

2.exports.isUsernameNotTaken
	2.1. Username is already taken
	{
	    "status": 400,
	    "msg": {
	        "username": "Username is already taken"
	    }
	}