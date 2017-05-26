import React, { Component } from "react";
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
			return <WeatherForcastListItem key={index} type={forecastType} weather={obj} />;
		});
	}


	render(){
		let { forecastText, switchText } = this.state;

		return (
			<div className="container-fluid">
				<div className="row justify-content-center">
					<div className="forecast-container col-10">
						<div className="row">
							<div className="col">
								<h2>{forecastText} Forecast</h2>
							</div>	
						</div>	
						<CSSTransitionGroup
							transitionName="dropIn"
							component="div"
							className="row forecast-row"
							transitionEnterTimeout={500}
							transitionLeaveTimeout={300}>
								{this.renderForecasts()}
						</CSSTransitionGroup>
						<div className="row switch-container">
							<div className="col">
								<a href="javascript:;" onClick={this.forecastTypeSwitch}>{switchText}</a>
							</div>	
						</div>		
						
					</div>
				</div>	
			</div>
		);
	}
}


WeatherForcastList.propTypes = { 
	hourly: PropTypes.array.isRequired,
	daily: PropTypes.array.isRequired
};

export default WeatherForcastList;
