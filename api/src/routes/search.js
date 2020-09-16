const app = require('express').Router();
const {Product} = require('../db.js');
const {Op} = require('sequelize');

app.get('/', (req, res) => {
	const valor = req.query.valor;
	Product.findAll({
		where: {
			[Op.or]: [{titulo: {[Op.like]: `%${valor}%`}}, {descripcion: {[Op.like]: `%${valor}%`}}],
		},
	}).then(products => {
		res.send(products);
	});
});

module.exports = app;
