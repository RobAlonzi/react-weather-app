import React from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**  
 * Component that will create the 'Hourly Forecast' items for the panel
 * @param {Object[]} forecasts - Array of hourly forecast objects
 * @returns {Function}
 * */
const HourlyForcastList = ({ forecasts }) => {
	return forecasts.map((forecast, index) => {
		return (
			<CSSTransition key={index} component="div" classNames="dropIn" timeout={{ enter: 500, exit: 300}}>
				<Grid item xs={12} md={6} lg={2} className="weather-drop-in">
					<div className="forecast-list-item">
						<h3>{forecast.times.hour}</h3>
						<span>{forecast.times.day}</span>
						<img src={`http://openweathermap.org/img/w/${forecast.icon.path}.png`} alt={forecast.icon.text}/>
						<h4>{forecast.weather.temperature}&deg;C</h4>
						<p>{forecast.icon.text}</p>
						<div className="forecast-details">
							<p>Cloud Coverage: {forecast.weather.clouds}%</p>
							<p>Humidity: {forecast.weather.humidity}%</p>
							{ forecast.weather.snow ?  <p>Snow: {forecast.weather.snow.toFixed(2)}mm</p> : null }
							{ forecast.weather.rain ?  <p>Rain: {forecast.weather.rain.toFixed(2)}mm</p> : null }
							<p>Wind Speed: {forecast.weather.wind} meter/sec</p>
						</div>
					</div>
				</Grid>
			</CSSTransition>
		);
	})
};

HourlyForcastList.propTypes = { 
	forecasts: PropTypes.array.isRequired
};

export default HourlyForcastList;

