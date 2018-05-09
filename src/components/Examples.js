import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from "prop-types";

import "../css/Examples.scss";

/**  
 * Component that will create the 'Examples' section
 * @returns {Function}
 * */
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

Examples.propTypes = { 
	handleSearch: PropTypes.func.isRequired
};

export default Examples;