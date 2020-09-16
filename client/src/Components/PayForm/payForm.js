import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { FormControl, Container, InputLabel, Input, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import './payForm.css';
import { putProduct } from '../../Actions/index';
import swal from 'sweetalert';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
}));

const alerswal = () => {
  return swal({
    title: 'Exito',
    text: 'Compra exitosa',
    icon: 'success',
    button: 'Continuar',
  });
}


function PayForm({ user, productsCar, putProduct }) {
  const [state, setState] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [redir, setRedir] = useState(false);
  const [error, setError] = useState(false);

  const [expanded, setExpanded] = useState('panel1');
  const classes = useStyles();
  const handleOnChange = e => {
    setState({
      ...state,
      [e.target.id]: e.target.value,
    });
  };
  console.log(state)

  function comprar() {
    const { carritoId } = productsCar[0]?.lineorder;
    console.log(carritoId);
    return axios
      .put(
        `http://localhost:3005/orders/${user.id}`,
        { estado: 'completa', carritoId },
        { withCredentials: true },
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  if (redirect && !error) {
    return <Redirect to="/sendform" />;
  }

  if (redir && !error) {
    return <Redirect to={`/users/${user.id}/orders`} />;
  }
  console.log(user.email)
  const handleSendEmail = () => {
    axios
      .post('http://localhost:3005/sendemail/purchaseMade', { email: user.email })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  console.log(productsCar)
  const handleStock = () => {
    productsCar.map(p => {
      p.stock = p.stock - p.lineorder.cantidad
      console.log(p, p.id)
      putProduct(p, p.id)
    }
    )
  }
  var control
  var regEmail = new RegExp(/^\S+@\S+\.\S+$/)

  return (
    <div>
      {user.id ? (
        <div>
          <div className='alls'>
            <h3>Cómo querés pagar?</h3>
          </div>
          <div>
            <Container className={classes.root}>
              <Accordion>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Tarjeta de credito</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <small style={{ opacity: '0.7' }}>Utilizar datos que figuran en la tarjeta.</small>
                    <FormControl
                    >
                      <Container className="form-group">
                        <FormControl>
                          <InputLabel htmlFor="Nombre">Nombre</InputLabel>
                          <Input
                            style={{ marginRight: '5%', width: '100%' }}
                            type="Nombre"
                            id="Nombre"
                            onChange={e => handleOnChange(e)}
                          />
                        </FormControl>

                        <FormControl style={{ marginRight: '4%', marginLeft: '4%' }}>
                          <InputLabel htmlFor="Apellido">Apellido</InputLabel>
                          <Input
                            style={{ marginRight: '5%', width: '100%' }}
                            type="Apellido"
                            id="Apellido"
                            onChange={e => handleOnChange(e)}
                          />
                        </FormControl>

                        <FormControl style={{ marginRight: '4%' }}>
                          <InputLabel htmlFor="DNI">DNI</InputLabel>
                          <Input
                            style={{ marginRight: '5%', width: '100%' }}
                            type="number"
                            id="DNI"
                            onChange={e => handleOnChange(e)}
                          />
                          {state.DNI?.length == 8  && state.DNI > 13000000 ? (
                            <small id="emailHelp" className="form-text text-muted">
                              DNI valido.
                            </small>
                          ) : (
                            <small id="emailHelp" className="form-text text-muted">
                            Debe ser un DNI valido.
                          </small>
                            )}
                        </FormControl>

                        <FormControl style={{ marginRight: '4%' }}>
                          <InputLabel htmlFor="Tarjeta">Numero de Tarjeta</InputLabel>
                          <Input
                            style={{ marginRight: '5%', width: '100%' }}
                            type="string"
                            id="NumTarjeta"
                            aria-describedby="my-helper-text"
                            onChange={e => handleOnChange(e)}
                          />
                          {state.NumTarjeta?.length == 16 ?   null   :
                         <small id="emailHelp" className="form-text text-muted">
                          Debe ser una tarjeta valida.<br/>
                          NRO de tarjeta sin espacios.
                        </small>}
                        </FormControl>

                        <FormControl style={{ marginRight: '4%' }}>
                          <InputLabel htmlFor="CodSeguridad">Codigo de Seguridad</InputLabel>
                          <Input
                            style={{ marginRight: '5%', width: '100%' }}
                            type="string"
                            id="CodSeguridad"
                            onChange={e => handleOnChange(e)}
                          />
                          {state.CodSeguridad?.length == 3 || !state.CodSeguridad ? null : <small id="emailHelp" className="form-text text-muted">
                          Codigo incorrecto.
                        </small>}
                        </FormControl>

                        <FormControl style={{ marginRight: '4%' }}>
                          <InputLabel htmlFor="MM/AAAA">MM/AA</InputLabel>
                          <Input
                            type="string"
                            id="FechaExp"
                            onChange={e => handleOnChange(e)}
                          />
                          <FormHelperText>
                            Fecha de expiracion.
                  </FormHelperText>
                        </FormControl>
                        {state.DNI &&
                         state.Nombre &&
                         state.Apellido &&
                         state.CodSeguridad &&
                         state.FechaExp &&
                         state.NumTarjeta &&
                         state.CodSeguridad?.length == 3 &&
                         state.NumTarjeta?.length == 16 ?
                        (control = false) : (control = true)}
                        <Button
                        disabled={control ? true : false}
                          variant="contained"
                          color="primary"
                          onClick={() => { comprar(); handleSendEmail(); handleStock(); setRedir(true); alerswal()}}
                          style={{ position: 'relative', top: '1em', left: '12em' }}
                        >
                          Comprar
            		</Button>
                      </Container>
                    </FormControl>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Container>
            <Container className={classes.root}>
              <Accordion>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Efectivo</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <Button color="primary" variant="outlined">Comprar con Pago Facil</Button>
                    </Typography>
                  </AccordionDetails>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <Button color="primary" variant="outlined">Comprar con Rapipago</Button>
                    </Typography>
                  </AccordionDetails>
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}></Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      <Button color="primary" variant="outlined">Comprar con Mercado Pago</Button>
                    </Typography>
                  </AccordionDetails>
                </AccordionDetails>
              </Accordion>
            </Container>
          </div>
          <footer>
            <Button color="primary" variant="outlined" style={{ left: '8%', position: 'relative', top: '25px' }} onClick={() => setRedirect(true)}>
              Regresar
        </Button>
          </footer>
        </div>
      ) : (
          <Redirect to="/" />
        )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    productsCar: state.productsCar,
    user: state.user,
  };
}
export default connect(mapStateToProps, { putProduct })(PayForm);

