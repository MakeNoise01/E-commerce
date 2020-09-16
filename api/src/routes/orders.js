const server = require('express').Router();
const {Carrito, Product} = require('../db.js');
const {Op} = require('sequelize');
const {isAdmin, isAuthenticated} = require('./validations');

server.get('/', isAdmin, (req, res) => {
	//Ruta trae todas las ordenes... Dentro de tabla de orden
	Carrito.findAll({
		where: {
		    [Op.or]: [{estado: 'completa'}, {estado: 'despachada'}, {estado: 'cancelada'}],
		},
		include: {
			model: Product,
		},
	})
		.then(completados => {
			res.send(completados);
		})
		.catch(err => {
			console.log(err);
		});
});

server.get('/:id', isAuthenticated, (req, res) => {
	// Ruta trae orden de usuario en especifico, completadas... de componente orden
	Carrito.findOne({
		where: {
			userId: req.params.id,
			[Op.or]: [{estado: 'completa'}, {estado: 'despachada'}, {estado: 'cancelada'}],
		},
		include: {
			model: Product,
		},
	})
		.then(completados => {
			res.send(completados);
		})
		.catch(err => {
			console.log(err);
		});
});

server.put('/:id', isAuthenticated, (req, res) => {
	//ruta actualiza orden
	var data = req.body;
	console.log(data);
	console.log(req.params.id)
	Carrito.findOne({
		where: {
			userId: req.params.id,
			id: data.carritoId,
		},
		include:{model: Product}
	})
		.then(completados => {
			console.log(completados)
			completados.update({
				estado: data.estado,
			});
			completados.save();
			res.send(completados);
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = server;
