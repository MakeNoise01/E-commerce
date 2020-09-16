import React, { useState } from 'react';
import axios from 'axios';
import '../FormUsuario/Form.css';
import './sendForm.css'
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

function SendForm({ user }) {
	const [state, setState] = useState({});
	const [redirect, setRedirect] = useState(false);
	const [redir, setRedir] = useState(false);
	const [error, setError] = useState(false)
	const handleOnChange = e => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (event, state) => {
		console.log(state)
		event.preventDefault();
		axios
			.put(`http://localhost:3005/users/${user.id}`, state, { withCredentials: true })
			.then(res => {
				if (res.data.error) {
					setError(true)
				} else { setError(false) }
			})
			.catch(error => console.log(error))
	};

	const handleCancel = () => {
		console.log('holaaa')
		return axios
			.put(`http://localhost:3005/orders/${user.id}`, { estado: 'activo' }, { withCredentials: true })
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}


	if (redirect && !error) {
		return <Redirect to="/paymentmethods" />;
	}
	if (redir && !error) {
		return <Redirect to="/cart/:userId" />;
	}

	var control;
	return (
		<div>
			{user.id ? (
				<div>
					<div className="Formms">
						<form
							onSubmit={e => {
								handleSubmit(e, state);
								setTimeout(function () {
									setRedirect(true);
								}, 1500);
							}}>
							<div className="form-group">
								<h3>¿Donde querés recibir tu compra?</h3>
								<label htmlFor="exampleInputDireccion"></label>
								<input
									name="direccion"
									placeholder="Direccion"
									type="text"
									className="form-control"
									id="exampleInputDireccion"
									onChange={e => handleOnChange(e)}
								/>
								<label htmlFor="exampleInputCP"></label>
								<input
									name="cp"
									placeholder="Codigo Postal"
									type="number"
									className="form-control"
									id="exampleInputCP"
									onChange={e => handleOnChange(e)}
								/>
								<label htmlFor="exampleInputCiudad"></label>
								<input
									name="ciudad"
									placeholder="Ciudad"
									type="text"
									className="form-control"
									id="exampleInputCiudad"
									onChange={e => handleOnChange(e)}
								/>
								<label htmlFor="exampleInputProvincia"></label>
								<input
									name="provincia"
									placeholder="Provincia"
									type="text"
									className="form-control"
									id="exampleInputProvincia"
									onChange={e => handleOnChange(e)}
								/>
							</div>

							<Button
								variant="contained"
								type='button'
								color='secondary'
								value="button"
								onClick={() => { handleCancel(); setRedir(true); }}
							>
								Cancelar
							</Button>
							{!state.direccion ||
								!state.cp ||
								!state.ciudad ||
								!state.provincia
								? (control = true)
								: false}
							<Button disabled={control ? true : false}
								variant="contained"
								className='skere'
								type='submit'
								style={{ marginLeft: '48%' }}
								value="Submit"
							>
								Continuar
							</Button>
						</form>
					</div>
				</div>
			) : (
					<Redirect to="/login" />
				)}
		</div>
	);
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps)(SendForm);
