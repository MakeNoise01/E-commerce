const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const { User } = require('./db.js');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;


require('./db.js');


passport.use(
	new Strategy({ usernameField: 'email' }, function (username, password, done) {
		console.log('app.user' + username);
		User.findOne({
			where: {
				email: username,
			},
		})
			.then(user => {
				console.log(user.correctPassword(password));
				if (!user) {
					return done(null, false);
				}
				if (!user.correctPassword(password)) {
					return done(null, false);
				}
				return done(null, user);
			})
			.catch(err => {
				return done({ error: true });
			});
	}),
);
passport.serializeUser(function (user, done) {
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findByPk(id)
		.then(user => {
			done(null, user.get());
		})
		.catch(err => {
			return done(err);
		});
});
const server = express();

server.name = 'API';
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(morgan('dev'));
server.use(cookieParser());
server.use(
	require('express-session')({
		secret: 'secret',
		resave: false,
		saveUninitialize: false,
	}),
);
server.use(passport.initialize());
server.use(passport.session());
server.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
	next();
});

server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => {
	// eslint-disable-line no-unused-vars
	const status = err.status || 500;
	const message = err.message || err;
	console.error(err);
	res.status(status).send(message);
});

server.use((req, res, next) => {
	console.log(req.session);
	console.log(req.user);
	next();
});

module.exports = server;
