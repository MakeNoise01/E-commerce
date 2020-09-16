import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom';
import swal from 'sweetalert';
import {putProduct} from '../../Actions/index';
import {connect} from 'react-redux';

function OrderButtons({
	id,
	userId,
	createdAt,
	precios,
	putOrder,
	users,
	estado,
	putProduct,
	products,
}) {
	const handleSendEmailDesp = userId => {
		const userEmail = users?.filter(u => u.id === userId)[0]?.email;
		axios
			.post('http://localhost:3005/sendemail/purchaseDispatched', {email: userEmail})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	};
	const handleSendEmailCan = userId => {
		const userEmail = users.filter(u => u.id === userId)[0].email;
		axios
			.post('http://localhost:3005/sendemail/purchaseCancel', {email: userEmail})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	};
	const handleOnClick = (e, estado, userId) => {
		var name = e.target.name;
		swal({
			title: '¿Estas Seguro?',
			icon: 'warning',
			buttons: true,
			dangerMode: true,
		}).then(willDelete => {
			if (willDelete) {
				putOrder(userId, estado, name);
				swal(`Orden ${estado} con exito!`, {
					icon: 'success',
				});
			} else {
				swal('Accion cancelada!');
			}
		});
	};
	const handleStock = () => {

		products.map(p => {
			p.stock = p.stock + p.lineorder.cantidad;
			console.log(p, p.id);
			putProduct(p, p.id);
		});
	};
	console.log(estado);

	let control = true;
	if (estado === 'despachada' || estado === 'cancelada') {
		control = false;
	}

	return (
		<tbody key={id}>
			<tr>
				<th scope="row">{id}</th>
				<td>{users.filter(u => u.id === userId)[0]?.email ? users.filter(u => u.id === userId)[0]?.email : 'Usuario eliminado'}</td>
				<td> {precios} </td>
				<td>{createdAt?.slice(0, 10)}</td>
				<td> {estado} </td>
				<td>
					<Link to={`/order/${id}`}>
						<button className="orderID">DETALLE</button>
					</Link>
				</td>
				{control ? (
					<div>

						<td>
							<button
								className="despachar"
								name={id}
								onClick={e => {
									handleOnClick(e, 'despachada', userId);
									handleSendEmailDesp(userId);
								}}>
								DESPACHAR
							</button>
						</td>
						<td>
							<button
								className="cancelar"
								name={id}
								onClick={e => {
									handleOnClick(e, 'cancelada', userId);
									handleSendEmailCan(userId);
									handleStock();
								}}>
								CANCELAR
							</button>
						</td>
					</div>
				) : null}
			</tr>
		</tbody>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}
export default connect(mapStateToProps, {putProduct})(OrderButtons);
