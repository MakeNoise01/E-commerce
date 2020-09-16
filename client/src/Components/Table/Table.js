import React, {useState} from 'react';
import MaterialTable from 'material-table';
import {addProduct, putProduct, deleteProduct} from '../../Actions/index.js';
import './table.css';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {storage} from '../../firebase';
import Button from '@material-ui/core/Button';

function Table({products, addProduct, putProduct, deleteProduct, user}) {
	const [image, setImage] = useState(null);
	const [save, setSave] = useState(null);
	const [redir, setRedir] = useState(false)
	const [error, setError] = useState(false)
	const handleChange = e => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};
	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		uploadTask.on(
			'state_changed',
			snapshot => {},
			error => {
				console.log(error);
			},
			() => {
				storage
					.ref('images')
					.child(image.name)
					.getDownloadURL()
					.then(url => {
						setSave(url);
					});
			},
		);
	};

	const columns = [
		{title: 'Titulo', field: 'titulo'},
		{title: 'Descripción', field: 'descripcion'},
		{title: 'Precio', field: 'precio', type: 'numeric'},
		{title: 'Stock', field: 'stock', type: 'numeric'},
		// {title: 'Categoría', field: 'category', lookup: catOptions},
		{
			title: 'Imagen',
			field: 'imagen',
			editComponent: () => (
				<div value="photo">
					<input type="file" onChange={handleChange} />
					<label htmlFor="raised-button-file">
						<button onClick={handleUpload}>Upload</button>
					</label>
				</div>
			),
			render: rowData => <img src={rowData.imagen} style={{width: 100}} />,
		},
	];
	if (redir && !error) {
		return <Redirect to="/settings" />;
	}

	return (
		<div>
			{user.admin ? (
				<MaterialTable
					title="Productos"
					columns={columns}
					data={products}
					editable={{
						onRowAdd: newData => addProduct(newData, save),
						onRowUpdate: (newData, oldData) => putProduct(newData, oldData.id),
						onRowDelete: oldData => deleteProduct(oldData.id),
					}}
				/>
			) : (
				<Redirect to="/" />
			)}
			<Button  style={{marginTop: '2%', marginLeft: '2%'}} color = "secondary" variant= "contained" onClick= {setRedir}>
			Regresar
			</Button>
		</div>
	);
}
const mapStateToProps = state => {
	return {
		products: state.products,
		user: state.user,
	};
};
export default connect(mapStateToProps, {
	addProduct,
	putProduct,
	deleteProduct,
})(Table);
