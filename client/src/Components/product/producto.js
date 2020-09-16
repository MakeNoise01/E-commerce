import React from 'react';
import './producto.css';
import {addToCart, getReviews} from '../../Actions/index';
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

export function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Products(producto) {
	const [open, setOpen] = React.useState(false);
	const handleClick = () => {
		setOpen(true);
	};
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	return (
		<div className="wrapper">
			<div>
				<img src={producto?.producto[0]?.imagen} className="Imga" />
			</div>
			<div className="Description">
				<h1>{producto?.producto[0]?.titulo}</h1>
				<div>
					<p>{producto?.producto[0]?.descripcion}</p>
					<div>
						<p style={{opacity: '0.6'}}>En stock: {producto?.producto[0]?.stock}</p>
					</div>
					<div className="califcs">
						<Link
						    style={{textDecoration: 'none'}}
							to={`/producto/${producto?.producto[0]?.id}/Calificaciones`}
							onClick={() => producto?.getReviews(producto?.producto[0]?.id)}>
							<Button variant="contained" color="secondary">
								Calificaciones
							</Button>
						</Link>
					</div>
				</div>
				<div className="Precio">
					<h3>$ {producto?.producto[0]?.precio}</h3>
					<button
						type="button"
						className="btn btn-sm btn-primary float-right"
						variant="contained"
						color="primary"
						onClick={e => {
							handleClick();
							producto.addToCart(1, e.target.name);
						}}
						style={{marginRight: '3%'}}
						name={producto?.producto[0]?.id}
						disabled={producto?.producto[0]?.stock === 0 ? true : false}>
						{producto?.producto[0]?.stock === 0 ? 'Sin Stock' : 'Comprar'}
					</button>
					<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
						<Alert onClose={handleClose} severity="success">
							Agregado al carrito!
						</Alert>
					</Snackbar>
				</div>
			</div>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}
export default connect(mapStateToProps, {addToCart, getReviews})(Products);
