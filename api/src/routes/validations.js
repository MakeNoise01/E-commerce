function isAuthenticated(req, res, next) {
	console.log("HOLAAAA" + req.user)
	if (req.isAuthenticated()) {
		next();
	} else {
		res.send('Deberias loguearte');
		res.status(404);
	}
}

function isAdmin(req, res, next) {
	
	if (req.user && req.user.admin === true) {
		next();
	} else {
		console.log(req.user)
		res.send('Permiso denegado');
	}
}
module.exports = {isAuthenticated, isAdmin};
