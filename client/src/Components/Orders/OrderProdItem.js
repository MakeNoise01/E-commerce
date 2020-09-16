import React, {useState} from 'react';
import Axios from 'axios';
import BeautyStars from 'beauty-stars';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function OrderProdItem({titulo, precio, cantidad, imagen, id, user}) {
	const [tarea, setTarea] = useState('');
	const [value, setValue] = useState(0);

	const submitRate = (idUser, idProd) => {
		// CAMBIAR DONDE HACE SUBMIT Y SACARLE EL HARDCODEO JAJA! AGREGAR COMENTARIOS. RENDERIZAR VALOR DE ESTRELLITA PROEDIO
		console.log(idUser);
		return Axios.post(
			`http://localhost:3005/products/${idUser}/review`,
			{
				rating: value,
				descripcion: tarea,
				productId: idProd,
				userId: idUser,
			},
			{withCredentials: true},
		)
			.then(success => console.log(success))
			.catch(err => console.log(err));
	};

	var control;
	return (
		<tr>
			<th style={{width: '15%'}} scope="row">
				{titulo}
			</th>
			<td style={{width: '15%'}}>${precio}</td>
			<td style={{width: '15%'}}>{cantidad} </td>
			<td style={{width: '25%'}}>
				<img style={{width: '45%'}} src={imagen} />
			</td>
			<td style={{width: '30%'}}>
				<BeautyStars
					value={value}
					size={'24px'}
					gap={'6px'}
					activeColor={'66C3FF'}
					onChange={value => setValue(value)}
				/>
				<TextField
					style={{marginTop: '8px', size: '6px'}}
					id="outlined-basic"
					label="Opinion"
					variant="outlined"
					name="body"
					onChange={e => setTarea(e.target.value)}></TextField>
				{!value || !tarea ? (control = true) : false}
				<Button
					variant="outlined"
					color="primary"
					style={{marginLeft: '4px', marginTop: '8px'}}
					disabled={control ? true : false}
					onClick={() => {
						submitRate(user.id, id);
					}}>
					Calificar
				</Button>
			</td>
		</tr>
	);
}
