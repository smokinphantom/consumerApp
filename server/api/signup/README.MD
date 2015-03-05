Sample outputs
1. For invalid username
{
    "status": 400,
    "msg": {
        "username": "Username must be atleast 6 characters in length with no special characters"
    }
}

2. Username already taken
{
    "status": 400,
    "msg": {
        "username": "Username is already taken"
    }
}

3. Invalid password phone and email
{
    "status": 400,
    "msg": {
        "password": "Password must be atleast 8 characters long and should contain atleast one number",
        "phone": "Please enter a valid phone number",
        "email": "Please enter a valid email"
    }
}

4. email is already registered
{
    "status": 400,
    "msg": {
        "email": "Email is already registered"
    }
}