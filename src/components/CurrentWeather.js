import React from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

import "../css/WeatherText.scss";

/**  
 * Component that will create the 'Current Weather' panel
 * @param {String} city - The name of the location
 * @param {Object} forecast - Current forecast information
 * @returns {Function}
 * */
const CurrentWeather = ({ city, forecast }) => {

	let forecastIcons = forecast.icon.map((obj, index) => {
		return (
			<Grid item key={index}>
				<img src={`http://openweathermap.org/img/w/${obj.path}.png`} alt={obj.text}/>
				<p>{obj.text}</p>
			</Grid>
		);
	});

	return (
		<Grid container className="current-container">
			<Grid item xs={12}>
				<h1>It is currently {forecast.times.current} and {forecast.weather.temperature}&deg;C in {city}...</h1>
			</Grid>
			<Grid item xs={12} className="current-weather-details">
				{forecastIcons}
			</Grid>

			<Grid container className="current-footer">
				<Grid item xs={6} >
					<span>Sunrise: {forecast.times.sunrise}</span>
					<span>Sunset: {forecast.times.sunset}</span>
				</Grid>
				<Grid item xs={6} >
					<span>Cloud Coverage: {forecast.weather.clouds}%</span>
					<span>Humidity: {forecast.weather.humidity}%</span>
					<span>Wind Speed: {forecast.weather.wind} meter/sec</span>
				</Grid>
				<Grid item xs={12} className="last-updated">
					Last Updated: {forecast.times.lastUpd}
				</Grid>
			</Grid>
		</Grid>
	);
};

CurrentWeather.propTypes = { 
	city: PropTypes.string.isRequired,
	forecast: PropTypes.object
};

export default CurrentWeather;

