import React, { Component } from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

import "../css/ForecastPanel.scss";
import "../css/ForecastPanelItem.scss";

const ForecastPanel = ({children, handleSwitch, title, switchTxt }) => {
	return (
		<Grid container className="forecast-container">
			<Grid item xs={12}>
				<h2>{`${title} Forecast`}</h2>	
			</Grid>
			
			{children}

			<Grid item xs={12} className="switch-container">
				<a href="javascript:;" onClick={handleSwitch}>{`Switch to ${switchTxt}`}</a>		
			</Grid>			
		</Grid>
	);
}


ForecastPanel.propTypes = { 
	handleSwitch: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	switchTxt: PropTypes.string.isRequired,
};

export default ForecastPanel;
