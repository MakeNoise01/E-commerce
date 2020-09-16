const server = require('express').Router();
const {Op} = require('sequelize');
const {User, Carrito, Product} = require('../db.js');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const {isAdmin, isAuthenticated} = require('./validations');

server.get('/', isAdmin, (req, res) => {
	User.findAll()
		.then(users => {
			res.send(users);
		})
		.catch(err => {
			console.log(err);
		});
});

server.post('/', (req, res) => {
	if (req.body.email === 'soyadmin@admin.com') {
		const {email, password, nombre, apellido} = req.body;
		User.create({
			nombre,
			apellido,
			email,
			password,
			admin: true,
		}).then(user => res.status(201).send(user));
	} else {
		User.create(req.body)
			.then(user => {
				res.status(201).send(user);
			})
			.catch(err => {
				res.send({error: true});
			});
	}
});

server.put('/:id', isAuthenticated, (req, res) => {
	var newEmail = req.body.email;
	var {direccion, cp, ciudad, provincia} = req.body;
	console.log(req.body);
	User.findOne({
		where: {
			id: req.params.id,
		},
	})
		.then(user => {
			user.update({
				email: newEmail,
				direccion: direccion,
				cp: cp,
				ciudad: ciudad,
				provincia: provincia,
			});
			user.save();
			res.status(200).send(user);
		})
		.catch(err => {
			res.send('Usuario inexistente');
		});
});

// server.delete('/:id', isAuthenticated, (req, res) => {
// 	User.findOne({
// 		where: {
// 			id: req.params.id,
// 		},
// 	})
// 		.then(user => {
// 			if (!user) {
// 				res.send('Usuario inexistente');
// 			} else {
// 				user.destroy();
// 				res.status(200).send(user);
// 			}
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// });
server.delete('/:id', isAuthenticated, (req, res) => {
	User.findOne({
		where: {
			id: req.params.id,
		},
	})
		.then(user => {
			if (!user) {
				res.send('Usuario inexistente');
			} else {
				if (req.params.id == req.user.id) {
					req.logout();
				}
				user.destroy();
				res.status(200).send(user);
			}
		})
		.catch(err => {
			console.log(err);
		});
});
server.post('/:ids/cart', (req, res) => {
	var ids = req.params.ids;
	const {id, cantidad, carritoId} = req.body;
	let pProduct = Product.findOne({
		where: {
			id: id,
		},
		include: [{model: Carrito}],
	});
	let pCarrito = Carrito.findOrCreate({
		where: {
			userId: ids,
			estado: 'activo',
		},
	});
	Promise.all([pCarrito, pProduct])
		.then(values => {
			let carrito = values[0][0];
			let producto = values[1];
			let first = producto.carritos.filter(cart => cart.id === carritoId);
			if (!first.length) {
				producto.addCarritos(carrito, {
					through: {cantidad: cantidad, precio: producto.precio},
				});
				return res.send(producto);
			} else {
				let cantidad = first[0].lineorder.cantidad;
				first[0].lineorder.update({
					cantidad: cantidad + 1,
				});
				first[0].lineorder.save();
				return res.send(producto);
			}
		})
		.catch(err => console.log(err));
});

server.get('/:ids/cart', (req, res) => {
	var ids = req.params.ids;
	Carrito.findOne({
		where: {
			userId: ids,
			estado: 'activo',
		},
		include: {
			model: Product,
		},
	})
		.then(carrito => {
			res.send(carrito.products);
		})
		.catch(err => {
			console.log(err);
		});
});

//ruta para traer las ordenes de un usuario
// server.get('/:userId/orders', (req, res) => {
// 	var id = req.params.userId;
// 	Carrito.findAll({
// 		where: {
// 			userId: id,
// 			estado: 'completa',
// 		},
// 		include: {
// 			model: Product,
// 		},
// 	})
// 		.then(orders => {
// 			res.send(carrito.products);
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// });

server.delete('/:ids/cart', (req, res) => {
	var ids = req.params.ids;
	if (!ids) {
		return 'done';
	}
	Carrito.findOne({
		where: {
			userId: ids,
			estado: 'activo',
		},
	})
		.then(carrito => {
			carrito.destroy();
			res.status(201).send('Carrito vaciado.');
		})
		.catch(err => {
			console.log(err);
		});
});

server.delete('/:ids/cart/:prodId', (req, res) => {
	var ids = req.params.ids;
	console.log(req.params);
	Carrito.findOne({
		where: {
			userId: ids,
			estado: 'activo',
		},
		include: {model: Product},
	})
		.then(carrito => {
			console.log(carrito);
			let result = carrito.products.filter(el => el.id == req.params.prodId);
			carrito.removeProducts(result[0]);
			res.status(201).send(result[0]);
		})
		.catch(err => {
			console.log(err);
		});
});

server.put('/:ids/cart', (req, res) => {
	var ids = req.params.ids;
	var data = req.body;
	Carrito.findOne({
		where: {
			userId: ids,
			estado: 'activo',
		},
		include: {
			model: Product,
		},
	})
		.then(carrito => {
			let result = carrito.products.filter(el => el.id === data.id);
			result[0].lineorder.update({
				cantidad: data.cantidad,
			});
			result[0].lineorder.save();
			res.send(result[0]);
		})
		.catch(err => {
			console.log(err);
		});
});

server.get('/:ids/orders', isAuthenticated, (req, res) => {
	//Ruta trae toda las ordenes de un usuario. Dentro de tabla de orden
	Carrito.findAll({
		where: {
			userId: req.params.ids,
			[Op.or]: [{estado: 'completa'}, {estado: 'despachada'}],
		},
		include: [{model: Product}],
	})
		.then(completados => {
			res.send(completados);
		})
		.catch(err => {
			console.log(err);
		});
});

server.post('/:ids/passReset', isAuthenticated, (req, res) => {
	var pass = req.body.password;
	User.findOne({
		where: {
			id: req.params.ids,
		},
	})
		.then(user => {
			user.update({
				password: pass,
			});
			res.send(user.correctPassword(pass)).status(201);
		})
		.catch(err => console.log(err));
});

server.post('/forgotPassReset', (req, res) => {
	console.log(req.body)
	var pass = req.body.password;
	User.findOne({
		where: {
			email: req.body.email,
		},
	})
		.then(user => {
			user.update({
				password: pass,
			});
			res.send(user.correctPassword(pass)).status(201);
		})
		.catch(err => console.log(err));
});

module.exports = server;
