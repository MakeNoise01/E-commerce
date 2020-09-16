const server = require('express').Router();
const {Product, Cat, Carrito} = require('../db.js');
const {isAdmin, isAuthenticated} = require('./validations');

server.get('/', (req, res, next) => {
	Product.findAll({
		include: [{model: Cat}],
	})
		.then(products => {
			console.log(products);
			res.send(products);
		})
		.catch(next);
});

server.get('/:id', (req, res, next) => {
	Product.findOne({
		where: {
			id: req.params.id,
		},
	}).then(product => {
		res.send(product); // O product.dataValues ?
	});
});

server.post('/', isAdmin, (req, res) => {
	Product.create(req.body).then(product => {
		res.status(201);
		res.json(product);
	});
});

server.put('/:id', isAuthenticated, (req, res) => {
	var productId = req.params.id;
	var data = req.body;
	console.log(data)
	Product.findOne({
		where: {
			id: productId,
		},
	})
		.then(product => {
			product.update({
				titulo: data.titulo,
				descripcion: data.descripcion,
				precio: data.precio,
				stock: data.stock,
				imagen: data.imagen,
			});
			product.save();
			res.status(200).send(product);
		})
		.catch(error => {
			res.status(400).send('Producto inexistente');
		});
});

server.delete('/:id', isAdmin, (req, res) => {
	var productId = req.params.id;
	Product.findOne({
		where: {
			id: productId,
		},
	})
		.then(product => {
			if (!product) {
				res.status(404).send('Producto inexistente');
			} else {
				let prod = product;
				product.destroy();
				res.status(200).send(prod);
			}
		})
		.catch(error => {
			res.status(400).send('Se produjo un error');
		});
});

server.post('/:idProducto/category/:idCategoria', isAdmin, (req, res) => {
	const {idProducto, idCategoria} = req.params;
	let promiseProduct = Product.findByPk(idProducto);
	let promiseCat = Cat.findByPk(idCategoria);
	Promise.all([promiseProduct, promiseCat])
		.then(values => {
			let product = values[0];
			let cat = values[1];
			cat.addProducts(product);
			res.send(product);
		})
		.catch(err => res.sendStatus(400));
});

server.delete('/:idProducto/category/:idCategoria', isAdmin, (req, res) => {
	const {idProducto, idCategoria} = req.params;
	let promiseProduct = Product.findByPk(idProducto);
	let promiseCat = Cat.findByPk(idCategoria);
	Promise.all([promiseProduct, promiseCat])
		.then(values => {
			let product = values[0];
			let cat = values[1];
			cat.removeProducts(product);
			res.send(product);
		})
		.catch(err => res.sendStatus(400));
});

server.get('/category/:nombreCat', (req, res) => {
	Cat.findAll({
		where: {
			titulo: req.params.nombreCat,
		},
		include: [
			{
				model: Product,
			},
		],
	}).then(cat => res.send(cat[0].products));
});
module.exports = server;
