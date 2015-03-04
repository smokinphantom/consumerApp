The server code is structured as follows.

	./app.js
		The server code starts here
		Creates an express-js server
		configure the api routes by requiring './routes.js'
		Configurations such as location of DB, port number and other configurations are set by requiring './config/environment'
			when a specific .js file is not specified, the require looks  for 'index.js' and loads that file. All other required files will be loaded in 'index.js'
		Connects to MongoLab Database
		Server listens to port
	
	./routes.js
		Adds all server modules - eg: signup, login
	
	./api
		./api/login
			
		./api/schema
		
		./api/signup	
		
		./api/http_constants
	
	