import React, {useState} from 'react';
import './Form.css';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import {login} from '../../Actions/index';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import swal from 'sweetalert';

export const handleLogIn = type => {
	if (type === 'success') {
		return swal({
			title: 'Exito',
			text: 'Sesion iniciada',
			icon: 'success',
			button: 'Continuar',
		});
	} else {
		return swal('Error', 'Usuario o contraseña incorrecta', 'error');
	}
};

export function Alert(props) {
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

function LoginUser({login}) {
	const [state, setState] = useState({});
	const [inputEmail, setInputEmail] = useState({});
	const [abrir, setAbrir] = useState(false);

	const handleOnChange = e => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleClick = () => {
		setOpen(true);
	};

	const handleOnSubmit = event => {
		event.preventDefault();
		login(state);
	};

	const handleClickAbrir = () => {
		setAbrir(true);
	};

	const handleCerrar = () => {
		setAbrir(false);
	};

	const handleSendEmail = () => {
		axios
			.post('http://localhost:3005/sendemail/forgottenPassword', {email: inputEmail})
			.then(res => {
				console.log(res);
				console.log(inputEmail);
				localStorage.setItem('email', inputEmail);
			})

			.catch(err => console.log(err));
	};

	return (
		<div style={{marginTop: '2%'}} className="Formm">
			<form onSubmit={e => handleOnSubmit(e)}>
				<div className="form-group">
					<label htmlFor="exampleInputEmail1"></label>
					<TextField
						style={{width: '60%', marginTop: '1%'}}
						name="email"
						label="E-mail"
						type="email"
						id="standard-basic"
						aria-describedby="emailHelp"
						onChange={e => handleOnChange(e)}
					/>
					<label htmlFor="exampleInputPassword"></label>
					<TextField
						style={{width: '60%', marginTop: '1%'}}
						name="password"
						label="Contraseña"
						type="password"
						id="standard-basic1"
						onChange={e => handleOnChange(e)}
					/>
					<small id="emailHelp" className="form-text text-muted">
						No compartiremos tus datos con nadie.
					</small>
				</div>
				<Link to="#" style={{display: 'block', marginBottom: '20px'}} onClick={handleClickAbrir}>
					<span>¿Olvidaste tu contraseña?</span>
				</Link>
				<div>
					<Dialog open={abrir} onClose={handleCerrar} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">¿Olvidaste tu contraseña?</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Por favor ingresa el email con el que te registraste y te enviaremos un email con
								los pasos a seguir.
							</DialogContentText>
							<TextField
								onChange={e => setInputEmail(e.target.value)}
								autoFocus
								margin="dense"
								id="name"
								label="E-mail"
								type="email"
								name="userEmail"
								fullWidth
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCerrar} color="primary">
								Cancelar
							</Button>
							<Button
								onClick={() => {
									handleCerrar();
									handleSendEmail();
								}}
								color="primary">
								Recibir e-mail
							</Button>
						</DialogActions>
					</Dialog>
				</div>

				<Link style={{display: 'block', marginBottom: '20px'}} to="/sign_up">
					¿No tenes una cuenta? Registrate{' '}
				</Link>
				<Button
					onClick={() => {
						handleClick();
					}}
					variant="contained"
					color="primary"
					type="submit"
					value="Submit">
					Ingresar
				</Button>
			</form>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps, {login})(LoginUser);
