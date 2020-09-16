const server = require('express').Router();
var nodemailer = require('nodemailer');
const {USER, PASS} = process.env;

server.post('/purchaseMade', (req, res) => {
	// Definimos el transporter
	console.log(req.body.email);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'henrystoy123@gmail.com',
			pass: 'agusmarcosfrancomariano123',
		},
	});

	// Definimos el email
	var mailOptions = {
		from: 'Henrys toys <henrystoy123@gmail.com>',
		to: req.body.email,
		subject: 'Compra Realizada',
		text: 'Su compra fue realizada con exito, muchas gracias por confiar en Henrys toys',
	};
	// Enviamos el email
	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.sendStatus(500);
		} else {
			console.log('Email sent');
			res.sendStatus(200);
		}
	});
});

server.post('/purchaseDispatched', (req, res) => {
	// Definimos el transporter
	console.log(req.body.email);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'henrystoy123@gmail.com',
			pass: 'agusmarcosfrancomariano123',
		},
	});

	// Definimos el email
	var mailOptions = {
		from: 'Henrys toys <henrystoy123@gmail.com>',
		to: req.body.email,
		subject: 'Compra Despachada',
		text:
			'Su compra fue despachada, por cualquier consulta estamos a su disposicion, muchas gracias por confiar en Henrys toys',
	};
	// Enviamos el email
	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.sendStatus(500);
		} else {
			console.log('Email sent');
			res.sendStatus(200);
		}
	});
});

server.post('/purchaseCancel', (req, res) => {
	// Definimos el transporter
	console.log(req.body.email);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'henrystoy123@gmail.com',
			pass: 'agusmarcosfrancomariano123',
		},
	});

	// Definimos el email
	var mailOptions = {
		from: 'Henrys toys <henrystoy123@gmail.com>',
		to: req.body.email,
		subject: 'Compra Cancelada',
		text:
			'Su compra fue cancelada, por cualquier consulta estamos a su disposicion, lo esperamos pronto en Henrys toys',
	};
	// Enviamos el email
	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.sendStatus(500);
		} else {
			console.log('Email sent');
			res.sendStatus(200);
		}
	});
});

server.post('/forgottenPassword', (req, res) => {
	// Definimos el transporter
	console.log(req.body.email);
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'henrystoy123@gmail.com',
			pass: 'agusmarcosfrancomariano123',
		},
	});

	// Definimos el email
	var mailOptions = {
		from: 'Henrys toys <henrystoy123@gmail.com>',
		to: req.body.email,
		subject: 'Recuperar contraseña',
		text: 'Para resetear tu contraseña puedes ingresar a este link',
		html:
			'<span>Para obtener una nueva contraseña has click en el siguiente link</span> <a href="http://localhost:3000/recuperarContraseña">Resetear contraseña</a>',
	};
	// Enviamos el email
	transporter.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			res.sendStatus(500);
		} else {
			console.log('Email sent');
			res.sendStatus(200);
		}
	});
});

module.exports = server;
