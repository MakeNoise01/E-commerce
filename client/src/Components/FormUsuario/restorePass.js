import React, {useState} from 'react';
import {connect} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import './Form.css';
import axios from 'axios';
//import {getUser} from '../../Actions/index';

export function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
	root: {
	width: "100%",
	"& > * + *": {
		marginTop: theme.spacing(2),
	},
	},
}));

 function RestorePass({user}) {
   //var usuario = getUser();
  //console.log(usuario)
  const [state, setState] = useState({});
  const handleOnChange = (e) => {
    setState({
     ...state,
     [e.target.name]: e.target.value
    })
  }
  const handleSubmit = (event, state, ) => {
    event.preventDefault();
		axios
			.post(`http://localhost:3005/users/${user.id}/passReset`, {password: state.password}, {withCredentials: true})
			.then(res => console.log(res))
			.catch(error => console.log(error));
  }
  const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const handleClick = () => {
		setOpen(true);
		};
		const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpen(false);
		};

  var control;
  return (
    <div className="Formm">
      <form onSubmit={e => handleSubmit(e, state)}>
        <div className="form-group">
        <label htmlFor="exampleInputPassword">Ingrese su contraseña actual</label>
        <input
          name='actualPassword'
          placeholder='...'
          type="password"
          className="form-control"
          id="exampleInputPassword"
          onChange={e => handleOnChange(e)}
        />
        <label htmlFor="exampleInputPassword">Ingrese su nueva contraseña</label>
        <input
          name='password'
          placeholder='...'
          type="password"
          className="form-control"
          id="exampleInputPassword"
          onChange={e => handleOnChange(e)}
          //disabled={true}
        />
        { state.password?.length < 6 || !state.password ?
        <small id="emailHelp" className="form-text text-muted">
          La contraseña debe contener almenos 6 caracteres
        </small> : ''
        }
        <label htmlFor="exampleInputPassword">Confirme su nueva contraseña</label>
        <input className={state.password2 != state.password && 'danger'}
          name='password2'
          placeholder='...'
          type="password"
          className="form-control"
          id="exampleInputPassword"
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
      <button onClick = {handleClick} variant="contained" color="primary" type="submit"  value="Submit" disabled={control ? true : false}>
        Submit
      </button>
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
		user: state.user,
	};
}

export default connect(mapStateToProps)(RestorePass);
