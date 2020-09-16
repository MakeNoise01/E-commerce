import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getOrdersUser, getUser} from '../../Actions/index';
import {Link} from 'react-router-dom';
import './order.css';

function OrdersUser({user, ordersUser, getOrdersUser}) {
	useEffect(() => {
		getOrdersUser(user.id);
	}, [user]);

	var precios = [];
	for (let i = 0; i < ordersUser.length; i++) {
		var total = 0;
		var ord = ordersUser[i];
		for (let j = 0; j < ord.products.length; j++) {
			total += ord.products[j].precio;
		}
		precios.push(total);
	}

	return (
		<table className="table">
			<thead>
				<tr>
					<th scope="col">Orden N°</th>
					<th scope="col">Total ($)</th>
					<th scope="col">Fecha</th>
				</tr>
			</thead>
			{ordersUser?.map((o, i) => (
				<tbody key={o.id}>
					<tr>
						<th scope="row">{o.id}</th>
						<td> ${precios[i]} </td>
						<td>
							{o?.createdAt?.slice(8, 10) +
								'/' +
								o?.createdAt?.slice(5, 7) +
								'/' +
								o?.createdAt?.slice(0, 4)}
						</td>
						<td>
							<Link to={`/user/order/${o.id}`}>
								<button className="orderID">DETALLE</button>
							</Link>
						</td>
					</tr>
				</tbody>
			))}
		</table>
	);
}

function mapStateToProps(state) {
	return {
		ordersUser: state.ordersUser,
		user: state.user,
	};
}

export default connect(mapStateToProps, {getOrdersUser, getUser})(OrdersUser);
