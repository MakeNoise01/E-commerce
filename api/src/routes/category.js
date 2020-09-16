const server = require('express').Router();
const {Cat} = require('../db.js');
const {isAdmin} = require('./validations');

server.get('/', (req, res) => {
	//prettier-ignore
	Cat.findAll()
	.then(cats => res.send(cats)
	.catch(err => res.send(err)));
});

server.post('/', isAdmin, (req, res) => {
	Cat.create(req.body)
		.then(category => {
			res.status(201).send(category);
		})
		.catch(err => res.send(err));
});

server.delete('/:id', isAdmin, (req, res) => {
	var categoriaId = req.params.id;
	Cat.findOne({
		where: {
			id: categoriaId,
		},
	})
		.then(category => {
			let cat = category;
			category.destroy();
			res.status(200).send(cat);
		})
		.catch(error => {
			res.status(400).send('Categoria inexistente');
		});
});

server.put('/:id', isAdmin, (req, res) => {
	var categoriaId = req.params.id;
	console.log(categoriaId);
	var data = req.body;
	Cat.findOne({
		where: {
			id: categoriaId,
		},
	})
		.then(category => {
			category.update({
				titulo: data.titulo,
				descripcion: data.descripcion,
			});
			category.save();
			res.send(category);
		})
		.catch(error => {
			res.status(400).send('Producto inexistente');
		});
});

module.exports = server;
