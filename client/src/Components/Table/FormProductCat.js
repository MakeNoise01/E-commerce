import React, {useState} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

function FormProductCat({categories}) {
	const [prodId, setProdId] = useState();
	const [catId, setCatId] = useState();
	const [selectCat, setSelectCat] = useState('post');

	const handleCatSubmit = event => {
		event.preventDefault();
		switch (selectCat) {
			case 'post':
				return axios
					.post(`http://localhost:3005/products/${prodId}/category/${catId}`)
					.then(res => console.log(res.data))
					.catch(err => console.log(err));
			case 'delete':
				return axios
					.delete(`http://localhost:3005/products/${prodId}/category/${catId}`)
					.then(res => console.log(res.data))
					.catch(err => console.log(err));
			default:
				return;
		}
	};
	const handleOnChange = event => {
		setProdId(event.target.value);
		if (!catId) setCatId(categories[0]?.id);
	};
	return (
		<form onSubmit={e => handleCatSubmit(e)} className="formcont">
			<h2 className="tit"> Agregar Categorías a un Producto</h2>
			<span className="labelcat">
				<label> Acción </label>
				<label> Id Producto </label>
				<label> Id Categoria </label>
			</span>
			<span className="inputcat">
				<select name="options" onChange={e => setSelectCat(e.target.value)}>
					<option value="post">Agregar</option>
					<option value="delete">Eliminar</option>
				</select>
				<input type="number" name="productId" placeholder="Agregar..." onChange={handleOnChange} />
				<select onChange={e => setCatId(e.target.value)}>
					{categories?.map((c, i) => (
						<option key={i} value={c.id}>
							{c.titulo}
						</option>
					))}
				</select>
				<input type="submit" value="+" className="bot btn-success" />
			</span>
		</form>
	);
}

const mapStateToProps = state => {
	return {
		categories: state.categories,
	};
};
export default connect(mapStateToProps)(FormProductCat);
