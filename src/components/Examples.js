import React from 'react';
import Grid from 'material-ui/Grid';

import "../css/Examples.scss";

const Examples = props => {
	return (
		<Grid item className="city-examples">
			<p>Examples</p>
			<ol>
				<li><a onClick={() => props.handleSearch("Toronto, Canada")} href="javascript:;">Toronto, Canada</a></li>
				<li><a onClick={() => props.handleSearch("Montevideo, Uruguay")} href="javascript:;">Montevideo, Uruguay</a></li>
				<li><a onClick={() => props.handleSearch("Tokyo, Japan")} href="javascript:;">Tokyo, Japan</a></li>
				<li><a onClick={() => props.handleSearch("Rome, Italy")} href="javascript:;">Rome, Italy</a></li>
			</ol>	
		</Grid>
	);
}

export default Examples;