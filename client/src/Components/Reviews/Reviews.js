import React from 'react';
import './Review.css';
import {connect} from 'react-redux';

import BeautyStars from 'beauty-stars';

function Reviews({reviews}) {
	console.log(reviews);

	// useEffect(() => {
	// 	getReviews(1);
	// }, [reviews]);
	let suma = 0;
	for (var i = 0; i < reviews.length; i++) {
		suma = suma + parseInt(reviews[i].rating);
	}

	return (
		<div className="reviews">
			{reviews.length === 0 ? null : (
				<div className="totalStars">
					<h4>Calificacion promedio {(suma / reviews.length).toFixed(2)} / 5</h4>
					<BeautyStars
						value={suma / reviews.length}
						size={'24px'}
						gap={'6px'}
						activeColor={'66C3FF'}
					/>
					<span>Calificaciones ({reviews.length})</span>
				</div>
			)}
			{reviews.length === 0 ? (
				<h3>Este producto aun no tiene calificaciones</h3>
			) : (
				reviews?.map(r => (
					<div key={r.user?.id} className="describe">
						<div className="name1">
							{r.user?.nombre ? <h3>
								{r.user?.nombre} {r.user?.apellido}
							</h3> : <h3>Usuario</h3>}						
						</div>
						<div className="descrip">
							<h4>{r.descripcion}</h4>
						</div>
						<div className="stars">
							<BeautyStars value={r.rating} size={'24px'} gap={'6px'} activeColor={'66C3FF'} />
							<br />
						</div>
					</div>
				))
			)}
		</div>
	);
}

function mapStateToProps(state) {
	return {
		reviews: state.reviews,
	};
}

export default connect(mapStateToProps)(Reviews);
