import React from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

import "./WeatherText.scss";

const WeatherText = ({ city, weather }) => {

	let weatherText = weather.weatherText.map((obj, index) => {
		return (
			<div key={index} className="col">
				<img src={`http://openweathermap.org/img/w/${obj.icon}.png`} alt={obj.text}/>
				<p>{obj.text}</p>
			</div>
		);
	});

	return (
		<Grid container className="current-container">
			<Grid item xs={12}>
				<h1>It is currently {weather.time} and {weather.temperature}&deg;C in {city}...</h1>
			</Grid>
			<Grid item xs={12} className="current-weather-details">
				{weatherText}
			</Grid>

			<Grid container className="current-footer">
				<Grid item xs={6} >
					<span>Sunrise: {weather.sunrise}</span>
					<span>Sunset: {weather.sunset}</span>
				</Grid>
				<Grid item xs={6} >
					<span>Cloud Coverage: {weather.clouds}%</span>
					<span>Humidity: {weather.humidity}%</span>
					<span>Wind Speed: {weather.wind} meter/sec</span>
				</Grid>
				<Grid item xs={12} className="last-updated">
					Last Updated: {weather.lastUpd}
				</Grid>
			</Grid>
		</Grid>
	);
};

WeatherText.PropTypes = { 
	city: PropTypes.string.isRequired,
	weather: PropTypes.object.isRequired
};

export default WeatherText;

