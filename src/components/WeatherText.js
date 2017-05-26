import React from "react";
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
		<div className="container-fluid">
			<div className="row justify-content-center">
				<div className="col-10 current-container">
					<h1>It is currently {weather.time} and {weather.temperature}&deg;C in {city}...</h1>

					<div className="row current-weather-details">
						{weatherText}
					</div>
					<div className="row current-footer">
						<div className="col-lg-4 col-md-6 col-sm-12">
							<span>Sunrise: {weather.sunrise}</span>
							<span>Sunset: {weather.sunset}</span>
						</div>
						<div className="col-lg-4 col-md-6 col-sm-12">
							<span>Cloud Coverage: {weather.clouds}%</span>
							<span>Humidity: {weather.humidity}%</span>
							<span>Wind Speed: {weather.wind} meter/sec</span>
						</div>
						<div className="last-updated col-lg-4 col-md-12 col-sm-12">
							Last Updated: {weather.lastUpd}
						</div>
					</div>	
					
				</div>	
			</div>
		</div>
	);
};

WeatherText.propTypes = { 
	city: PropTypes.string.isRequired,
	weather: PropTypes.object.isRequired
};

export default WeatherText;

