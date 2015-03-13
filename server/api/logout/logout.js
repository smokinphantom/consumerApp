exports.logout = function(request, response){
	if(request.session.username){
		request.session.destroy(function(err){
			if(err){
				console.log(err);
			}
			else
			{
				response.redirect('/');
			}
		});
	}
	else{
		response.status(400);
		response.json("User already logged out");
	}
};
