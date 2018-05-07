import React from "react";
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';

import "./WeatherForcastListItem.scss";

function createHourlyListItem(weather){
	return (
		<Grid item xs={12} md={6} lg={2} className="weather-drop-in">
			<div className="forecast-list-item">
				<h3>{weather.timeHour}</h3>
				<span>{weather.timeDay}</span>
				<img src={`http://openweathermap.org/img/w/${weather.icon}.png`} alt={weather.weatherText}/>
				<h4>{weather.temperature}&deg;C</h4>
				<p>{weather.weatherText}</p>
				<div className="forecast-details">
					<p>Cloud Coverage: {weather.clouds}%</p>
					<p>Humidity: {weather.humidity}%</p>
					{ weather.snow ?  <p>Snow: {weather.snow.toFixed(2)}mm</p> : null }
					{ weather.rain ?  <p>Rain: {weather.rain.toFixed(2)}mm</p> : null }
					<p>Wind Speed: {weather.wind} meter/sec</p>
				</div>
			</div>
		</Grid>
	);
}

const WeatherForcastListItem = ({ type, weather }) => {
	if(type === "hourly"){
		return createHourlyListItem(weather);
	} else{
		return (
			<Grid item xs={12} md={6} lg={2} className="daily-forecast weather-drop-in">
				<div className="forecast-list-item">
					<h3>{weather.timeDay}</h3>
					<img src={`http://openweathermap.org/img/w/${weather.icon}.png`} alt={weather.weatherText}/>
					<h4>High: {weather.tempMax}&deg;C</h4>
					<h4>Low: {weather.tempMin}&deg;C </h4>
					<p>{weather.weatherText}</p>
					<div className="forecast-details">
						<p>Cloud Coverage: {weather.clouds}%</p>
						<p>Humidity: {weather.humidity}%</p>
						{ weather.snow ?  <p>Snow: {weather.snow.toFixed(2)}mm</p> : null }
						{ weather.rain ?  <p>Rain: {weather.rain.toFixed(2)}mm</p> : null }
					</div>
				</div>
			</Grid>
		);
	}
};


WeatherForcastListItem.PropTypes = { 
	type: PropTypes.string.isRequired,
	weather: PropTypes.object.isRequired
};

export default WeatherForcastListItem;

