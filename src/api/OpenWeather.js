import axios from 'axios';

import * as Utility from "../helpers/Utilities";
import "../config/config";

// URLS to get the data
const API_KEY = process.env.API_KEY;
const ROOT_URL_DAILY = `http://api.openweathermap.org/data/2.5/forecast/daily?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_HOURLY = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_CURRENT = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;


/**  
 * Hits the OpenWeatherMapAPI and returns the result, rejects with the error message if neccessary 
 * @param {string} url - The OpenWeatherMapAPI URL requested
 * @returns {Promise}
 * */
const getOpenWeatherMapData = (url) =>{
	return axios.get(url).then(res => {
		
		// If the response isn't a 200, something went wrong and we should throw the error 
		if(res.data.cod !== "200" && res.data.cod !== 200){
			throw new Error(res.data.message);
		}

		// Return the data
		return res.data;

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err.data.message);
	});
}


/**  
 * Makes a request to the OpenWeatherMapAPI for the current forecast of the given location, 
 * formats and returns an object with the neccesary info
 * @param {Object} info - Info about the location we need to lookup (timezone, GPS coords)
 * @returns {Promise}
 * */
const getCurrentWeather = info => {
	
	// Get location info, and generate the API URL
	const { coords, timezone } = info;
	const CURRENT_URL = `${ROOT_URL_CURRENT}&lat=${coords.lat}&lon=${coords.lon}`;
	
	// Get the data from OpenWeatherMap
	return getOpenWeatherMapData(CURRENT_URL).then(forecast => {

		// For the icon info, we want to capitalize the first letter
		// of the description (eg: clear sky => Clear Sky)
		let icon = forecast.weather.map(obj => {
			return {
				text: Utility.capitalizeFirstLetter(obj.description),
				path: obj.icon
			};
		});
		
		// Create the object in a formatted way for consumption. 
		return {
			times: {
				current: Utility.timestampToLocalTime({ timestamp: Utility.getCurrentTimestamp(), timezone, format:"h:mm A", needsUtc: false }),
				lastUpd: Utility.timestampToLocalTime({ timestamp: forecast.dt, timezone, format:"MMM Do, h:mm A", needsUtc: true }),
				sunrise: Utility.timestampToLocalTime({ timestamp: forecast.sys.sunrise, timezone, format:"h:mm A", needsUtc: true }),
				sunset: Utility.timestampToLocalTime({ timestamp: forecast.sys.sunset, timezone, format:"h:mm A", needsUtc: true }),
			},
			weather: {
				temperature: forecast.main.temp,
				humidity: forecast.main.humidity,
				clouds: forecast.clouds.all,
				wind: forecast.wind.speed,
			},
			icon
		};

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err);
	});
};


/**  
 * Makes a request to the OpenWeatherMapAPI for the hourly forecast of the given location, 
 * formats and returns an object with the neccesary info
 * @param {Object} info - Info about the location we need to lookup (timezone, GPS coords)
 * @returns {Promise}
 * */
const getHourlyWeather = info => {

	// Get location info, and generate the API URL
	const { coords, timezone } = info;
	const HOURLY_URL = `${ROOT_URL_HOURLY}&lat=${coords.lat}&lon=${coords.lon}`;

	// Get the data from OpenWeatherMap
	return getOpenWeatherMapData(HOURLY_URL).then(forecast => {

		// Loop over each forecast given
		return forecast.list.map(hour => {

			// Return an object in a formatted way for consumption. 
			return {
				times: {
					hour: Utility.timestampToLocalTime({ timestamp: hour.dt, timezone, format:"h A", needsUtc: true }),
					day: Utility.timestampToLocalTime({ timestamp: hour.dt, timezone, format:"MMM Do", needsUtc: true })
				},
				weather:{
					humidity: hour.main.humidity,
					temperature: hour.main.temp,
					clouds: hour.clouds.all,
					rain: hour.rain ? hour.rain["3h"] : null,
					snow: hour.snow ? hour.snow["3h"] : null,
					wind: hour.wind.speed
				},
				icon: {
					text: Utility.capitalizeFirstLetter(hour.weather[0].description),
					path: hour.weather[0].icon
				}
			};
		});

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err);
	});
};


/**  
 * Makes a request to the OpenWeatherMapAPI for the daily forecast of the given location, 
 * formats and returns an object with the neccesary info
 * @param {Object} info - Info about the location we need to lookup (timezone, GPS coords)
 * @returns {Promise}
 * */
const getDailyWeather = info => {

	// Get location info, and generate the API URL
	const { coords, timezone } = info;
	const DAILY_URL = `${ROOT_URL_DAILY}&lat=${coords.lat}&lon=${coords.lon}`;

	// Get the data from OpenWeatherMap
	return getOpenWeatherMapData(DAILY_URL).then(forecast => {

		// Loop over each forecast given
		return forecast.list.map(day => {

			// Return an object in a formatted way for consumption. 
			return {
				times: {
					day: Utility.timestampToLocalTime({ timestamp: day.dt, timezone, format:"MMM Do", needsUtc: true })
				},
				weather:{
					clouds: day.clouds,
					humidity: day.humidity,
					rain: day.rain ? day.rain : undefined,
					snow: day.snow ? day.snow : undefined,
					tempMin: day.temp.min,
					tempMax: day.temp.max,
				},
				icon: {
					text: Utility.capitalizeFirstLetter(day.weather[0].description),
					path: day.weather[0].icon
				}
			};
		});

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err);
	});
};

// Export
module.exports = {
	getCurrentWeather,
	getHourlyWeather,
	getDailyWeather
};