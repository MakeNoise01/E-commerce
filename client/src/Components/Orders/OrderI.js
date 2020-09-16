import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './Order1.css';
import Button from '@material-ui/core/Button';
import {Redirect} from 'react-router';

function Order({orders, match}) {
	const [redir, setRedir] = useState(false);
	var ord = orders?.filter(o => o?.id == match?.params?.id);
	var prods = ord[0]?.products;
	var total = 0;
	for (let i = 0; i < prods?.length; i++) {
		total += prods[i]?.precio * prods[i]?.lineorder?.cantidad;
	}
	if (redir) {
		return <Redirect to="/settings" />;
	}
	return (
		<div className="orderUser">
			<div id="combine">
				<div id="nroYuser">
					<h1>NRO ORDEN: {ord[0]?.id}</h1>
					<h1 style={{marginLeft: '200px'}}>ID USUARIO: {ord[0]?.userId}</h1>
				</div>
				<div id="hora">
					<h3>Fecha: {ord[0]?.createdAt.slice(0, 10)}</h3>
					<h3>Hora: {ord[0]?.createdAt.slice(11, 19) }</h3>
				</div>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th scope="col">Nombre producto</th>
						<th scope="col">Precio</th>
						<th scope="col">Cantidad</th>
						<th scope="col">Product ID</th>
					</tr>
				</thead>
				<tbody>
					{prods?.map(p => (
						<tr key={p.id}>
							<th scope="row">
								<Link to={`/product/${p.id}`} key={p.id}>
									{p.titulo}
								</Link>
							</th>
							<td>${p.precio}</td>
							<td>{p.lineorder.cantidad}</td>
							<td>{p.id}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div id="totalprecio">
				<h2>TOTAL : ${total}</h2>
			</div>
			<Button style={{marginTop: '2%', marginRight: '85%'}} color = "secondary" variant= "contained" onClick= {setRedir}>
			Regresar
			</Button>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		orders: state.orders,
	};
};
export default connect(mapStateToProps)(Order);
