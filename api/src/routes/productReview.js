const server = require('express').Router();
const { Review, User } = require('../db.js');
const {isAuthenticated} = require('./validations.js');

server.post('/:id/review', isAuthenticated, (req, res) => {
	var userId = req.params.id;
	console.log(userId);
	console.log(req.body);
	Review.findOrCreate({
		where: {
			productId: req.body.productId,
			userId: userId,
		},
		defaults: {
			descripcion: req.body.descripcion,
			rating: req.body.rating.toString(),
		},
	}) //req.body recibe producto, rating y descripcion
		.then(rev => {
			res.status(201).send(rev);
		})
		.catch(err => {
			res.sendStatus(400);
		});
});

// server.post('/:id/review', (req, res) => {
// 	var userId = req.params.id;
// 	Review.create(req.body) //req.body recibe producto, rating y descripcion
// 		.then(rev => {
// 			res.status(201).send(rev);
// 		})
// 		.catch(err => {
// 			res.sendStatus(400);
// 		});
// });

server.get('/:prodId/reviews', (req, res) => {
	var prodId = req.params.prodId;
	console.log(prodId);
	Review.findAll({
		where: {
			productId: prodId,
		},
		include: {
			model: User
		}
	})
		.then(reviews => {
			res.status(200).send(reviews);
		})
		.catch(err => {
			res.sendstatus(400);
		});
});
//ruta que trae todos los reviews de todos los productos de todos los usuarios (el 1 no sabemos porque tiene q ir pero funciona "no sacar")
server.get('/totalreviews/1', (req, res) => {
	Review.findAll()
		.then(reviews => {
			console.log(reviews);
			res.status(200).send(reviews);
		})
		.catch(err => {
			res.sendstatus(400);
		});
});

module.exports = server;
/* server.post('/:idProducto/category/:idCategoria', isAdmin, (req, res) => {
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
}); */
