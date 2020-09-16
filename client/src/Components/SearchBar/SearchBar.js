import React, {useState} from 'react';
import './SearchBar.css';

export default function SerchBar({search}) {
	const [input, setInput] = useState('');
	return (
			<form
				className="form"
				onSubmit={e => {
					e.preventDefault();
					search(input);
					setInput('');
				}}>
				<input
					className="input3"
					type="text"
					value={input}
					placeholder="Buscar..."
					onChange={event => setInput(event.target.value)}
				/>
				<input className="IBBoton" type="submit" value="Buscar" />
			</form>
	);
}
