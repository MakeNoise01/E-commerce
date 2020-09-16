import React, {useState} from 'react';
import {connect} from 'react-redux';
import OrderProdItem from './OrderProdItem';
import {Redirect} from 'react-router'
import Button from '@material-ui/core/Button';

function OrderProducts({ordersUser, match, user}) {
	const [redir, setRedir] = useState(false);
	var ord = ordersUser?.filter(o => o?.id == match?.params?.id);
	var prods = ord[0]?.products;
	var total = 0;
	for (let i = 0; i < prods?.length; i++) {
		total += prods[i]?.precio * prods[i]?.lineorder?.cantidad;
	}
	if (redir) {
		return <Redirect to= {`/users/${user.id}/orders`} />;
	}

	return (
		<div>
			<div
				style={{
					width: '100%',
					backgroundImage: 'linear-gradient(90deg,whitesmoke, rgb(30, 147, 243))',
					borderBottomRightRadius: '30px',
				}}>
				<h1>NRO ORDEN: {ord[0]?.id}</h1>
				<h3>Fecha: {ord[0]?.createdAt.slice(0, 10)}</h3>
				<h3>Hora: {ord[0]?.createdAt.slice(11, 19)}</h3>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">Nombre producto</th>
						<th scope="col">Precio</th>
						<th scope="col">Cantidad</th>
						<th scope="col">Imagen</th>
						<th scope="col">Calificacion</th>
					</tr>
				</thead>
				<tbody>
					{prods?.map(p => (
						<OrderProdItem
							titulo={p.titulo}
							precio={p.precio}
							cantidad={p.lineorder.cantidad}
							imagen={p.imagen}
							key={p.id}
							id={p.id}
							user={user}
						/>
					))}
				</tbody>
			</table>
			<div
				style={{
					display: 'flex',
					marginLeft: '70%',
					marginRight: '12%',
					marginTop: '10px',
					backgroundColor: 'rgb(30, 147, 243)',
					borderRadius: '7px',
					padding: '0.5%',
					color: 'whitesmoke',
				}}>
				<h2>TOTAL: ${total}</h2>
			</div>
			<Button style={{marginTop: '2%', marginLeft: '2%'}} color = "secondary" variant= "contained" onClick= {setRedir}>
			Regresar
			</Button>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		orders: state.orders,
		ordersUser: state.ordersUser,
		user: state.user,
	};
};
export default connect(mapStateToProps)(OrderProducts);
