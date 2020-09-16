import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import './User.css';
import {deleteUsers} from '../../Actions';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function User({user, deleteUsers}) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<div>
			{user.id ? (
				<div className="userProf">
					<div id="user">
						<div>
							{user.admin ? (
								<img
									style={{
										marginLeft: '40px',
										width: '76%',
										borderRadius: '140px',
										marginBottom: '5px',
										marginTop: '10px',
									}}
									src="https://www.vasport.vn/public/admin/img/avatar.png"
								/>
							) : (
								<img
									style={{borderRadius: '140px', marginBottom: '5px', marginTop: '10px'}}
									src="data:image/png;base64,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"></img>
							)}
						</div>
						<div className="userData">
							{user.admin ? <span>ADMINISTRADOR: </span> : <span>CLIENTE:</span>}
							<h1>
								{user.nombre} {user.apellido}
							</h1>
							<p> E-mail: {user.email} </p>
							<Link to={`/users/${user.id}/orders`}>
								<button className="compra">Mis Compras</button>
							</Link>
							<Link to="/RestablecerContraseña">
								<button className="changePass">Cambiar contraseña</button>
							</Link>
							<button className="deleteAcc" onClick={handleClickOpen}>
								Eliminar Cuenta
							</button>
							<Dialog
								open={open}
								TransitionComponent={Transition}
								keepMounted
								onClose={handleClose}
								aria-labelledby="alert-dialog-slide-title"
								aria-describedby="alert-dialog-slide-description">
								<DialogTitle id="alert-dialog-slide-title">{'Eliminar cuenta'}</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-slide-description">
										¿Estas seguro que quieres eliminar tu cuenta?
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleClose} color="primary">
										Cancelar
									</Button>
									<Button
										onClick={() => {
											deleteUsers(user.id);
											handleClose();
										}}
										color="primary">
										Aceptar
									</Button>
								</DialogActions>
							</Dialog>
						</div>
					</div>
				</div>
			) : (
				<Redirect to="/sign_up" />
			)}
		</div>
	);
}
function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps, {deleteUsers})(User);
