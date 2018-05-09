import React from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const DailyForcastList = ({ forecasts }) => {

	return forecasts.map((forecast, index) => {
		return (
			<CSSTransition key={index} component="div" classNames="dropIn" timeout={{ enter: 500, exit: 300}}>
				<Grid item xs={12} md={6} lg={2} className="daily-forecast weather-drop-in">
				<div className="forecast-list-item">
					<h3>{forecast.times.day}</h3>
					<img src={`http://openweathermap.org/img/w/${forecast.icon.path}.png`} alt={forecast.icon.text}/>
					<h4>High: {forecast.weather.tempMax}&deg;C</h4>
					<h4>Low: {forecast.weather.tempMin}&deg;C </h4>
					<p>{forecast.icon.text}</p>
					<div className="forecast-details">
						<p>Cloud Coverage: {forecast.weather.clouds}%</p>
						<p>Humidity: {forecast.weather.humidity}%</p>
						{ forecast.weather.snow ?  <p>Snow: {forecast.weather.snow.toFixed(2)}mm</p> : null }
						{ forecast.weather.rain ?  <p>Rain: {forecast.weather.rain.toFixed(2)}mm</p> : null }
					</div>
				</div>
			</Grid>
			</CSSTransition>
		);
	})
};


DailyForcastList.propTypes = { 
	forecasts: PropTypes.array.isRequired
};

export default DailyForcastList;

