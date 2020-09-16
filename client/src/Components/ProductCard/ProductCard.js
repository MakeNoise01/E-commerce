import React, {useEffect, useState} from 'react';
import './ProductCard.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {addToCart, getReviews} from '../../Actions/index';
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import BeautyStars from 'beauty-stars';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
}));
function ProductCard({
	imagen,
	titulo,
	precio,
	id,
	stock,
	addToCart,
	user,
	prodsCar,
	reviews,
	getReviews,
}) {
	// const handleOnCLick = (id, userId) => {
	//     axios.post(´http://localhost:3005/users/${userId}/cart´, {id: parseInt(id)});
	// };
	const carritoId = prodsCar[0]?.lineorder?.carritoId;
	const [suma, setSuma] = useState(0);
	const obtenerProductos = () => {
		let products;
		if (localStorage.getItem('productos') === null) {
			products = [];
		} else {
			products = JSON.parse(localStorage.getItem('productos'));
		}
		return products;
	};
	const getProducto = prodId => {
		return axios
			.get(`http://localhost:3005/products/${prodId}`, {withCredentials: true})
			.then(res => {
				res.data.lineorder = {cantidad: 1};
				let productos = obtenerProductos();
				let cambio = productos.filter(prod => prod.id === res.data.id)[0];
				console.log(cambio);
				console.log(res.data);
				if (cambio) {
					cambio.lineorder.cantidad = cambio.lineorder.cantidad + 1;
					for (let i = 0; i < productos.length; i++) {
						if (productos[i].id === cambio.id) productos[i] = cambio;
					}
				} else {
					productos.push(res.data);
				}
				localStorage.setItem('productos', JSON.stringify(productos));
			})
			.catch(err => console.log(err));
	};
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleClick = e => {
		if (user.id) {
			addToCart(user.id, e.target.name, null, carritoId);
		} else {
			getProducto(e.target.name);
		}
		setOpen(true);
	};
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	useEffect(() => {
		let sumar = 0;
		for (var i = 0; i < reviews.length; i++) {
			sumar = sumar + parseInt(reviews[i].rating);
		}
		setSuma(sumar);
	}, []);

	var promedio = suma / reviews.length;

	return (
		<div>
			<figure className="card card-product contein">
				<Link to={`/product/${id}`}>
					<div className="img-wrap">
						<img src={imagen} className="imagen" />
					</div>
				</Link>
				<figcaption className="info-wrap">
					<h4 className="title">{titulo}</h4>
					<div className="rating-wrap">
						<div className="label-rating">
							<BeautyStars value={promedio} size={'24px'} gap={'6px'} activeColor={'66C3FF'} />
							<small style={{opacity: '0.6'}}>Opiniones ({reviews.length})</small>
						</div>
					</div>
				</figcaption>
				<div className="bottom-wrap">
					<button
						className="btn btn-sm btn-primary float-right"
						onClick={e => handleClick(e)}
						name={id}
						disabled={stock === 0 ? true : false}>
						{stock === 0 ? 'Sin Stock' : 'Comprar'}
					</button>
					<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
						<Alert onClose={handleClose} severity="success">
							Agregado al carrito!
						</Alert>
					</Snackbar>
					<div className="price-wrap h5">
						<span className="price-new">${precio}</span>
					</div>
				</div>
			</figure>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user,
		prodsCar: state.productsCar,
	};
}
export default connect(mapStateToProps, {addToCart, getReviews})(ProductCard);
