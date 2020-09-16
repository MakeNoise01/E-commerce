import axios from 'axios';
import {handleLogIn} from '../Components/FormUsuario/loginUser';
import {
	GET_PRODUCTS,
	PUT_PRODUCT,
	DELETE_PRODUCT,
	SET_CATEGORY,
	DELETE_PROD_CATEGORY,
	POST_CATEGORY,
	PUT_CATEGORY,
	FILTER_BY_CATEGORY,
	GET_CATEGORIES,
	GET_CARRITO,
	DELETE_PROD_CART,
	ADD_TO_CART,
	GET_ORDER,
	SEARCH_PRODUCT,
	EMPTY_CART,
	GET_ORDERS,
	GET_USER,
	LOGIN,
	LOGOUT,
	SET_CANTIDAD,
	GET_USERS,
	DELETE_USERS,
	GET_REVIEWS,
	GET_ORDERS_USER,
	GET_TOTALREVIEWS,
	ERROR_LOGIN,
	PUT_ORDER,
	MAKE_ADMIN,
} from '../Constants/ProductsConstants';

//* PRODUCTS

export function getTotalReviews() {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/products/totalreviews/1`)
			.then(res => {
				console.log(res.data);
				dispatch({type: GET_TOTALREVIEWS, totalreviews: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function getOrdersUser(userId) {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/users/${userId}/orders`, {withCredentials: true})
			.then(res => {
				console.log(res.data);
				dispatch({type: GET_ORDERS_USER, ordersUser: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function getReviews(prodId) {
	console.log(prodId);
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/products/${prodId}/reviews`)
			.then(res => {
				console.log(res.data);
				dispatch({type: GET_REVIEWS, reviews: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function searchProduct(buscar) {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/search?valor=${buscar}`, {withCredentials: true})
			.then(res => {
				dispatch({type: SEARCH_PRODUCT, product: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function getProducts() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/products', {withCredentials: true})
			.then(res => {
				dispatch({type: GET_PRODUCTS, products: res.data});
			})
			.catch(err => console.log(err));
	};
}
export function addProduct(product, img) {
	product.imagen = img;
	return function (dispatch) {
		return axios
			.post('http://localhost:3005/products', product, {withCredentials: true})
			.then(res => {
				dispatch({type: 'ADD_PRODUCT', product: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function putProduct(product, id) {
	console.log(product, id);
	return function (dispatch) {
		return axios
			.put(`http://localhost:3005/products/${id}`, product, {withCredentials: true})
			.then(res => {
				dispatch({type: PUT_PRODUCT, product: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function deleteProduct(id) {
	return function (dispatch) {
		return axios
			.delete(`http://localhost:3005/products/${id}`, {withCredentials: true})
			.then(res => {
				dispatch({type: DELETE_PRODUCT, product: res.data});
			})
			.catch(err => console.log(err));
	};
}

//* CATEGORY
export function getCategories() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/category', {withCredentials: true})
			.then(res => {
				dispatch({type: GET_CATEGORIES, categories: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function postCategory(category) {
	return function (dispatch) {
		return axios
			.post('http://localhost:3005/category', category, {withCredentials: true})
			.then(res => {
				dispatch({type: POST_CATEGORY, category});
			})
			.catch(err => console.log(err));
	};
}

export function putCategory(category, id) {
	return function (dispatch) {
		return axios
			.put(`http://localhost:3005/category/${id}`, category, {withCredentials: true})
			.then(res => {
				dispatch({type: PUT_CATEGORY, category: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function deleteCategory(id) {
	return function (dispatch) {
		return axios
			.delete('http://localhost:3005/category/' + id, {withCredentials: true})
			.then(res => {
				dispatch({type: 'DELETE_CATEGORY', category: res.data});
			})
			.catch(err => console.log(err));
	};
}

//* PRODUCT-CATEGORY
export function setCategory(prodId, catId) {
	return function (dispatch) {
		return axios
			.post(`http://localhost:3005/products/${prodId}/category/${catId}`, null, {
				withCredentials: true,
			})
			.then(res => {
				dispatch({type: SET_CATEGORY});
			})
			.catch(err => console.log(err));
	};
}
export function deleteProdCategory(prodId, catId) {
	return function (dispatch) {
		return axios
			.delete(`http://localhost:3005/products/${prodId}/category/${catId}`, {withCredentials: true})
			.then(res => {
				dispatch({type: DELETE_PROD_CATEGORY});
			})
			.catch(err => console.log(err));
	};
}

export function filterByCategory(categoria) {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/products/category/${categoria}`, {withCredentials: true})
			.then(res => {
				dispatch({type: FILTER_BY_CATEGORY, catProducts: res.data});
			})
			.catch(err => console.log(err));
	};
}

//* CARRITO
export function getCarrito(userId) {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/users/${userId}/cart`, {withCredentials: true})
			.then(res => {
				dispatch({type: GET_CARRITO, productsCar: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function addToCart(userId, prodId, cant, carritoId) {
	let cantidad;
	if (cant) {
		cantidad = cant;
	} else {
		cantidad = 1;
	}

	return function (dispatch) {
		return axios
			.post(
				`http://localhost:3005/users/${userId}/cart`,
				{id: parseInt(prodId), cantidad: cantidad, carritoId},
				{withCredentials: true},
			)
			.then(res => {
				console.log(carritoId);
				console.log(res.data);
				let carr = res.data.carritos.filter(cart => cart.id === carritoId);
				if (carr.length) {
					console.log(carr);
					res.data.lineorder = carr[0].lineorder;
				} else {
					res.data.lineorder = {cantidad: 1};
				}
				dispatch({type: ADD_TO_CART, product: res.data});
			});
	};
}

export function setCantidad(userId, prodId, cantidades) {
	if (localStorage.getItem('productos') !== null) {
		let prods = JSON.parse(localStorage.getItem('productos'));
		let cambio = prods.filter(prod => prod.id === parseInt(prodId))[0];
		cambio.lineorder.cantidad = cantidades;
		for (let i = 0; i < prods.length; i++) {
			if (prods[i].id === cambio.id) prods[i] = cambio;
		}
		localStorage.setItem('productos', JSON.stringify(prods));
	}
	return function (dispatch) {
		axios
			.put(
				`http://localhost:3005/users/${userId}/cart`,
				{id: parseInt(prodId), cantidad: cantidades},
				{withCredentials: true},
			)
			.then(res => {
				dispatch({type: SET_CANTIDAD, product: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function deleteProdCart(userId, prodId) {
	if (localStorage.getItem('productos') !== null) {
		let prods = JSON.parse(localStorage.getItem('productos'));
		let newProds = prods.filter(prod => prod.id !== parseInt(prodId));
		localStorage.setItem('productos', JSON.stringify(newProds));
	}
	return function (dispatch) {
		return axios
			.delete(`http://localhost:3005/users/${userId}/cart/${prodId}`, {withCredentials: true})
			.then(res => {
				dispatch({type: DELETE_PROD_CART, productCar: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function emptyCart(id) {
	console.log(id);
	if (localStorage.getItem('productos') !== null) {
		localStorage.removeItem('productos');
	}
	return function (dispatch) {
		return axios
			.delete(`http://localhost:3005/users/${id}/cart`, {withCredentials: true})
			.then(res => {
				dispatch({type: EMPTY_CART, cart: []});
			})
			.catch(err => console.log(err));
	};
}
//* ORDERS
export function getOrder(id) {
	return function (dispatch) {
		return axios
			.get(`http://localhost:3005/orders/${id}`, {withCredentials: true})
			.then(res => {
				dispatch({type: GET_ORDER, orders: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function getOrders() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/orders', {withCredentials: true})
			.then(res => {
				dispatch({type: GET_ORDERS, orders: res.data});
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export function putOrder(userId, estado, carritoId) {
	return function (dispatch) {
		return axios
			.put(
				`http://localhost:3005/orders/${userId}`,
				{estado: estado, carritoId},
				{withCredentials: true},
			)
			.then(res => {
				dispatch({type: PUT_ORDER, order: res.data});
			})
			.catch(err => console.log(err));
	};
}

//* USERS

// export function login(user) {
// 	return function (dispatch) {
// 		return axios
// 			.post('http://localhost:3005/auth/login', user, {withCredentials: true})
// 			.then(res => {
// 				if (localStorage.getItem('productos') !== null) {
// 					let prods = JSON.parse(localStorage.getItem('productos'));
// 					console.log(prods);
// 					prods.map(prod => {
// 						addToCart(res.data.id, prod.id);
// 					});
// 					localStorage.clear();
// 				}
// 				dispatch({type: LOGIN, user: res.data});
// 			})
// 			.catch(error => console.log(error));
// 	};
// }

export function login(user) {
	let prods;
	if (localStorage.getItem('productos') !== null) {
		prods = JSON.parse(localStorage.getItem('productos'));
		localStorage.clear();
	}
	return function (dispatch) {
		return axios
			.post('http://localhost:3005/auth/login', user, {withCredentials: true})
			.then(res => {
				if (prods) {
					dispatch({type: LOGIN, user: res.data, prods});
				} else {
					dispatch({type: LOGIN, user: res.data, prods: false});
				}
				handleLogIn('success');
			})
			.catch(error => {
				handleLogIn('error');
				dispatch({type: ERROR_LOGIN, user: false});
			});
	};
}

export function getUser() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/auth/me', {withCredentials: true})
			.then(res => {
				dispatch({type: GET_USER, user: res.data});
			})
			.catch(err => console.log(err));
	};
}

export function logout() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/auth/logout', {withCredentials: true})
			.then(res => dispatch({type: LOGOUT}))
			.catch(error => console.log(error));
	};
}
export function getUsers() {
	return function (dispatch) {
		return axios
			.get('http://localhost:3005/users', {withCredentials: true})
			.then(res => dispatch({type: GET_USERS, users: res.data}))
			.catch(err => console.log(err));
	};
}
export function deleteUsers(id) {
	return function (dispatch) {
		return axios
			.delete(`http://localhost:3005/users/${id}`, {withCredentials: true})
			.then(res => dispatch({type: DELETE_USERS, deleteUser: res.data}))
			.catch(err => console.log(err));
	};
}

export function makeAdmin(id) {
	return function (dispatch) {
		return axios
			.post(`http://localhost:3005/auth/promote/${id}`, null, {withCredentials: true})
			.then(res => dispatch({type: MAKE_ADMIN, user: res.data}))
			.catch(err => console.log(err));
	};
}
