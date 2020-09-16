import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {getOrder, putOrder, getUsers, getOrders} from '../../Actions/index';
import './order.css';
import Button from '@material-ui/core/Button';
import OrderButtons from './orderButtons';
function Orders({orders, user, putOrder, users, getUsers, getOrders}) {
	const [redir, setRedir] = useState(false);
	const [ordenes, setOrdenes] = useState(orders);
	// let ordenes = orders;

	useEffect(() => {
		getUsers();
		getOrders()
	}, []);

	var precios = [];
	for (let i = 0; i < orders.length; i++) {
		var total = 0;
		var ord = orders[i];
		for (let j = 0; j < ord.products.length; j++) {
			total += ord.products[j].precio;
		}
		precios.push(total);
	}
	function filtrar(estado) {
		console.log(estado);
		if (estado !== 'todas') {
			setOrdenes(orders.filter(or => or.estado === estado));
		} else {
			setOrdenes(orders);
		}
		console.log(ordenes);
	}
	console.log(ordenes);
	if (redir) {
		return <Redirect to="/settings" />;
	}
	console.log(orders);
	return (
		<div>
			{user.admin ? (
				<div>
					<table className="table">
						<thead>
							<tr>
								<th scope="col">ID Orden</th>
								<th scope="col">User</th>
								<th scope="col">Total ($)</th>
								<th scope="col">Fecha</th>
								<th scope="col">Estado</th>
								<th scope="col">
									<label>Mostrar </label>
									<select onChange={e => filtrar(e.target.value)}>
										<option value="todas">Todas</option>
										<option value="completa">Completas</option>
										<option value="despachada">Despachadas</option>
										<option value="cancelada">Canceladas</option>
									</select>
								</th>
							</tr>
						</thead>
						{ordenes?.map((o, i) => (
							<OrderButtons
								id={o.id}
								userId={o.userId}
								precio={o.precio}
								createdAt={o.createdAt}
								estado={o.estado}
								putOrder={putOrder}
								users={users}
								products={o.products}
								precios={precios[i]}
							/>
						))}
					</table>
				</div>
			) : (
				<Redirect to="/" />
			)}
			<Button
				style={{marginTop: '2%', marginLeft: '2%'}}
				color="secondary"
				variant="contained"
				onClick={setRedir}>
				Regresar
			</Button>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		orders: state.orders,
		user: state.user,
		users: state.users,
	};
};

export default connect(mapStateToProps, {getOrder, putOrder, getUsers, getOrders})(Orders);
