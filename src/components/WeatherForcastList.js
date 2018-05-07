import React, { Component } from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import WeatherForcastListItem from "./WeatherForcastListItem";

import "./WeatherForcastList.scss";

class WeatherForcastList extends Component{
	constructor(props){
		super(props);

		this.state = {
			forecastType: "hourly",
			forecastText: "Hourly",
			switchText: "Switch to daily"
		};

		this.forecastTypeSwitch = this.forecastTypeSwitch.bind(this);
		this.renderForecasts = this.renderForecasts.bind(this);
	}

	forecastTypeSwitch(){
		let forecastType = this.state.forecastType === "hourly" ? "daily" : "hourly";
		let forecastText = forecastType.charAt(0).toUpperCase() + forecastType.slice(1);
		let switchText = forecastType === "hourly" ? "Switch to daily" : "Switch to hourly";

		this.setState({
			forecastType,
			forecastText,
			switchText
		});
	}

	renderForecasts(){
		let { forecastType } = this.state;

		return this.props[forecastType].map((obj, index) => {
			return (
				<CSSTransition key={index} component="div" classNames="dropIn" timeout={{ enter: 500, exit: 300}}>
					<WeatherForcastListItem type={forecastType} weather={obj} />
				</CSSTransition>
			);
		});
	}


	render(){
		let { forecastText, switchText } = this.state;

		return (
			<Grid container className="forecast-container">
				<Grid item xs={12}>
					<h2>{forecastText} Forecast</h2>	
				</Grid>
				
				{this.renderForecasts()}

				<Grid item xs={12} className="switch-container">
					<a href="javascript:;" onClick={this.forecastTypeSwitch}>{switchText}</a>		
				</Grid>			
			</Grid>
		);
	}
}


WeatherForcastList.PropTypes = { 
	hourly: PropTypes.array.isRequired,
	daily: PropTypes.array.isRequired
};

export default WeatherForcastList;
