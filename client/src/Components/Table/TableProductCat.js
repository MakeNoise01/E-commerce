import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import {setCategory, deleteProdCategory, getProducts} from '../../Actions/index.js';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router';
function TableProductCat({
	setCategory,
	deleteProdCategory,
	products,
	categories,
	getProducts,
	user,
}) {
	const [redir, setRedir] = useState(false);
	useEffect(() => {
		getProducts();
	}, [categories]);

	const catOptions = {};
	categories.map(category => {
		const {id, titulo} = category;
		if (titulo) catOptions[id] = titulo;
	});
	products.map(prod => {
		prod.category = catOptions;
	});
	const columns = [
		{title: 'Id Producto', field: 'id'},
		{title: 'Titulo Producto', field: 'titulo'},
		{title: 'Categoría', field: 'category', lookup: catOptions},
	];
	if (redir) {
		return <Redirect to="/settings" />;
	}

	return (
		<div>
			{user.admin ? (
				<MaterialTable
					title="Producto-Categoría"
					columns={columns}
					data={products}
					editable={{
						onRowUpdate: (oldData, newData) => setCategory(oldData.id, oldData.category),
					}}
					detailPanel={[
						{
							icon: 'visibility',
							tooltip: 'Mostrar categorias',
							render: rowData => {
								{
									console.log(rowData);
									console.log(products);
								}
								return (
									<div>
										<ul
											className="list-group"
											style={{
												fontSize: 18,
												color: 'white',
												backgroundColor: 'rgb(199 199 199)',
												marginRight: '15%',
											}}>
											{products
												.filter(prod => prod.id === rowData.id)[0]
												.cats.map(cat => (
													<li className="list-group-item active">
														{cat.titulo}{' '}
														<button
															name={cat.id}
															onClick={e => deleteProdCategory(rowData.id, e.target.name)}
															className="btn btn-danger">
															{' '}
															Eliminar{' '}
														</button>
													</li>
												))}
										</ul>
										<Button color="secondary" variant="contained" onClick={setRedir}>
											Regresar
										</Button>
									</div>
								);
							},
						},
					]}
				/>
			) : (
				<Redirect to="/" />
			)}
		</div>
	);
}
const mapStateToProps = state => {
	return {
		categories: state.categories,
		products: state.products,
		user: state.user,
	};
};
export default connect(mapStateToProps, {
	setCategory,
	deleteProdCategory,
	getProducts,
})(TableProductCat);
