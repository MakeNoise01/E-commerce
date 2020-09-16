import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles} from '@material-ui/core/styles';
import './Form.css';
import axios from 'axios';
import {getUsers} from '../../Actions/index';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

function ForgotPassword({users, getUsers}) {
	var email = localStorage.getItem('email');
	console.log(email);
	//var usuario = getUser();
	//console.log(usuario)
	const [state, setState] = useState({});
	const handleOnChange = e => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};
	const handleSubmit = (event, state) => {
		event.preventDefault();
		console.log(email);
		axios
			.post(`http://localhost:3005/users/forgotPassReset`, {
				email: email,
				password: state.password,
			})
			.then(res => {
				localStorage.removeItem('email');
				console.log(res);
			})
			.catch(error => {
				localStorage.removeItem('email');
				console.log(error);
			});
	};
	const classes = useStyles();
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

	useEffect(() => {
		getUsers();
	}, []);

  var control;
  return (
    <div style ={{marginTop: '5%', marginRight: '13%'}} className="Formm">
      <form onSubmit={e => handleSubmit(e, state)}>
        <div className="form-group">
        <TextField
          name='password'
          placeholder='Nueva contraseña'
          type="password"
          id="standard-basic"
          onChange={e => handleOnChange(e)}
          //disabled={true}
        />
        { state.password?.length < 6 || !state.password ?
        <small id="emailHelp" className="form-text text-muted">
          La contraseña debe contener almenos 6 caracteres
        </small> : <small id="emailHelp" className="form-text text-muted">
        </small> 
        }
        <TextField className={state.password2 != state.password && 'danger'}
          name='password2'
          placeholder='Confirmar contraseña'
          type="password"
          id="standard-basic"
          onChange={e => handleOnChange(e)}
          //disabled={true}
        />
        {
          state.password2 != state.password || state.password2 == null ?
         <small id="emailHelp" className="form-text text-muted">Las contraseñas deben ser las mismas</small> :
         <small id="emailHelp" className="form-text text-muted">Contraseña confirmada</small>
       }
      </div>
      {
      //  state.actualPassword != state.password ||
        !state.password2 ||
        state.password2 != state.password ||
        state.password.length < 6
        ? control = true : false
      }
	            <Button
					onClick={handleClick}
					variant="contained"
					color="primary"
					type="submit"
					disabled={control ? true : false}
					value="Submit">
					Actualizar
				</Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              Contraseña actualizada!
            </Alert>
      </Snackbar>
    </form>
  </div>
);

}

function mapStateToProps(state) {
	return {
		users: state.users,
	};
}

export default connect(mapStateToProps, {getUsers})(ForgotPassword);
