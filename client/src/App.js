import React, {useState, useEffect} from 'react';
import {Route} from 'react-router-dom';
import Catalogo from './Components/Catalogue/Catalogo';
import Products from './Components/product/producto';
import Table from './Components/Table/Table';
import TableCategory from './Components/Table/TableCategory';
import Cart from './Components/Carrito/Cart';
import NavBar from './Components/NavBar/NavBar';
import Orders from './Components/Orders/Order';
import Order from './Components/Orders/OrderI';
import FormUsuario from './Components/FormUsuario/FormUsuario';
import LoginUser from './Components/FormUsuario/loginUser';
import TableUser from './Components/Table/tableuser';
import user from './Components/FormUsuario/User';
import RestorePass from './Components/FormUsuario/restorePass.js';
import ForgotPassword from './Components/FormUsuario/forgotPassword.js';
import OrdersUser from './Components/Orders/ordersUser';
import OrderProducts from './Components/Orders/orderProducts';
import SendForm from './Components/PayForm/sendForm';
import PayForm from './Components/PayForm/payForm';
import Settings from './Components/Settings/Settings';
import {
	getProducts,
	getCategories,
	searchProduct,
	getOrder,
	getUser,
	getTotalReviews,
} from './Actions/index';
import Footer from './Components/Footer/Footer';
import {connect} from 'react-redux';
import Reviews from './Components/Reviews/Reviews';

function App({
	productos,
	catProducts,
	getCategories,
	categories,
	searchProduct,
	orders,
	getUser,
	getTotalReviews,
}) {
	const [buscar, setBuscar] = useState('');

	const filtrar = id => {
		return productos.filter(product => product.id == id);
	};

	useEffect(() => {
		getCategories();
		searchProduct(buscar);
		getUser();
		getTotalReviews();
	}, [buscar]);

	const search = input => {
		setBuscar(input);
	};

	return (
		<div className="product">
			<NavBar search={search} category={categories} />
			<Route
				exact
				path="/settings/products"
				render={() => <Table products={productos} categories={categories} />}
			/>
			<Route exact path="/" render={() => <Catalogo products={productos} />} />
			<Route path="/category/:category" render={() => <Catalogo products={catProducts} />} />
			<Route
				path="/product/:id"
				render={({match}) => <Products producto={filtrar(match.params.id)} />}
			/>
			<Route path="/settings/categories" component={TableCategory} />
			<Route exact path="/settings" component={Settings} />
			<Route path="/settings/orders" render={() => <Orders orders={orders} />} />
			<Route path="/order/:id" component={Order} />
			<Route path="/cart/:userId" component={Cart} />
			<Route path="/sign_up" component={FormUsuario} />
			<Route path="/login" component={LoginUser} />
			<Route path="/me" component={user} />
			<Route path="/RestablecerContraseña" render={() => <RestorePass users={getUser} />} />
			<Route path="/settings/users_table" component={TableUser} />
			<Route path="/producto/:prodId/Calificaciones" component={Reviews} />
			<Route path="/users/:userId/orders" component={OrdersUser} />
			<Route path="/user/order/:id" component={OrderProducts} />
			<Route path="/" component={Footer} />
			<Route path="/sendform" component={SendForm} />
			<Route path="/paymentmethods" component={PayForm} />
			<Route path="/recuperarContraseña" component={ForgotPassword} />
		</div>
	);
}

const mapStateToProps = state => {
	return {
		productos: state.products,
		catProducts: state.catProducts,
		categories: state.categories,
		orders: state.orders,
	};
};
export default connect(mapStateToProps, {
	getProducts,
	getCategories,
	searchProduct,
	getOrder,
	getUser,
	getTotalReviews,
})(App);
