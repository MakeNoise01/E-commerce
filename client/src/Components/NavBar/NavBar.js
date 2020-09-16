import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { filterByCategory, getProducts, getUser, logout, getUsers, haveCart } from '../../Actions/index';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1),
		},
		paper: {
			marginRight: theme.spacing(2),
		},
	},
}));

function NavBar({
	search,
	category,
	filterByCategory,
	getProducts,
	getUser,
	user,
	logout,
	productsCar,
}) {

	// const handleOnClick = () => {
	// 	axios
	// 		.get('http://localhost:3005/auth/logout', {withCredentials: true})
	// 		.then(res => console.log(res))
	// 		.catch(error => console.log(error));
	// };
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	// const [count, setCount] = useState(0);
	let cats = [];
	console.log(productsCar);
	// useEffect(() => {
	// 	if (productsCar.length) setCount(productsCar.length);
	// }, [productsCar]);

	category.map(category => {
		if (category.titulo) cats.push(category);
	});
	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
		prevOpen.current = open;
	}, [open]);

	return (
		<div className="contenedor">
			<nav className="navigatorbar">
				<Link to="/" id="chico" onClick={() => getProducts()}>
					<img
						className="logopp"
						src="https://i.pinimg.com/originals/de/78/93/de7893b704177d24089a11af2bf2349a.png"
					/>
				</Link>
				<div className="dropd">
					<button className="dropdbtn">
						Categorias
						<i className="fa fa-caret-down"></i>
					</button>
					<div className="dropd-cont" style={{ zIndex: '9999' }}>
						{cats?.map((c, i) => (
							<Link to={`/category/${c.titulo}`} onClick={e => filterByCategory(c.titulo)} key={i}>
								{c.titulo}
							</Link>
						))}
					</div>
				</div>
				{!user.id && <Link to="/sign_up"> Registrarse </Link>}
				{!user.id && <Link to="/login"> Iniciar Sesion </Link>}
				{user.admin && (
					<Link to="/settings" style={{ display: 'flex' }}>
						<span className="material-icons" style={{ width: '25px' }}>
							settings_icon
						</span>
						<span> Administrar </span>
					</Link>
				)}
				{/* {count ? <span className="num"> {count} </span> : null} */}
				{user.id && (
					<Button
						ref={anchorRef}
						aria-controls={open ? 'menu-list-grow' : undefined}
						aria-haspopup="true"
						onClick={handleToggle}>
						<Avatar src="/broken-image.jpg"></Avatar>
					</Button>
				)}

				{user.id && (
					<Popper
						open={open}
						anchorEl={anchorRef.current}
						role={undefined}
						transition
						disablePortal
						style={{ zIndex: 9999 }}>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
								<Paper>
									<ClickAwayListener onClickAway={handleClose}>
										<MenuList
											autoFocusItem={open}
											id="menu-list-grow"
											onKeyDown={handleListKeyDown}
											style={{
												display: 'flex',
												flexDirection: 'column',
												padding: '0px',
												color: 'black',
											}}>
											<Link to="/me" style={{ padding: '0px' }} onClick={() => getUser()}>
												<MenuItem onClick={handleClose}>
													<span style={{ color: 'black' }}>Perfil</span>
												</MenuItem>
											</Link>
											<Link to={`/users/${user.id}/orders`} style={{ padding: '0px' }}>
												<MenuItem onClick={handleClose}>
													<span style={{ color: 'black' }}>Mis compras</span>
												</MenuItem>
											</Link>
											<Link to="#" style={{ padding: '0px' }}>
												<MenuItem
													onClick={() => {
														handleClose();
														logout();
													}}>
													<span style={{ color: 'black' }}>Cerrar sesion</span>
												</MenuItem>
											</Link>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
				)}
				<SearchBar search={search} />
				{user.id && !productsCar.length && user.admin ?
				 <Link to={`/cart/${user.id}`} style={{ height: '65px', marginLeft: '30%' }}> {/* ADMIN / */}
					<span className="material-icons"> remove_shopping_cart </span>
				</Link> :
					user.id && productsCar.length >= 1 && user.admin ?
						<Link to={`/cart/${user.id}`} style={{ height: '65px', marginLeft: '30%' }}>
							<span className="material-icons">shopping_cart</span>  {/* / ADMIN / */}
						</Link> : 
						user.id && !productsCar.length ? <Link to={`/cart/${user.id}`} style={{ height: '65px', marginLeft: '42%' }}>
							<span className="material-icons"> remove_shopping_cart </span> {/* / USER / */}
						</Link> : 
						user.id && productsCar.length >= 1 ? <Link to={`/cart/${user.id}`} style={{ height: '65px', marginLeft: '42%' }}>
							<span className="material-icons">shopping_cart</span> {/* / USER /  */}
						</Link> :
						<Link to={`/cart/guest`} style={{ height: '65px', marginLeft: '30%' }}>
									<span className="material-icons"> remove_shopping_cart </span> {/* / NO LOGEADO */}
						</Link>}
			</nav>
		</div>
	);
}
function mapStateToProps(state) {
	return {
		user: state.user,
		productsCar: state.productsCar,
	};
}
export default connect(mapStateToProps, {
	filterByCategory,
	getProducts,
	getUser,
	logout,
	getUsers,
})(NavBar);
