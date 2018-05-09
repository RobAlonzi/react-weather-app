import axios from 'axios';
import moment from "moment";

import * as Utils from "./utilities";
import "../config/config";

// URLS to get the data
const API_KEY = process.env.API_KEY;
const ROOT_URL_DAILY = `http://api.openweathermap.org/data/2.5/forecast/daily?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_HOURLY = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_CURRENT = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;


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


const getCurrentWeather = info => {
	
	const { coords, timezone } = info;
	const CURRENT_URL = `${ROOT_URL_CURRENT}&lat=${coords.lat}&lon=${coords.lon}`;
	
	// Get the data from OpenWeatherMap
	return getOpenWeatherMapData(CURRENT_URL).then(forecast => {

		let icon = forecast.weather.map(obj => {
			return {
				text: capitalizeFirstLetter(obj.description),
				path: obj.icon
			};
		});
	
		return {
			times: {
				current: timestampToLocalTime({ timestamp: Utils.getCurrentTimestamp(), timezone, format:"h:mm A", needsUtc: false }),
				lastUpd: timestampToLocalTime({ timestamp: forecast.dt, timezone, format:"MMM Do, h:mm A", needsUtc: true }),
				sunrise: timestampToLocalTime({ timestamp: forecast.sys.sunrise, timezone, format:"h:mm A", needsUtc: true }),
				sunset: timestampToLocalTime({ timestamp: forecast.sys.sunset, timezone, format:"h:mm A", needsUtc: true }),
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


const getHourlyWeather = info => {

	const { coords, timezone } = info;
	const HOURLY_URL = `${ROOT_URL_HOURLY}&lat=${coords.lat}&lon=${coords.lon}`;

	return getOpenWeatherMapData(HOURLY_URL).then(forecast => {

		return forecast.list.map(hour => {
			
			return {
				times: {
					hour: timestampToLocalTime({ timestamp: hour.dt, timezone, format:"h A", needsUtc: true }),
					day: timestampToLocalTime({ timestamp: hour.dt, timezone, format:"MMM Do", needsUtc: true })
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
					text: capitalizeFirstLetter(hour.weather[0].description),
					path: hour.weather[0].icon
				}
			};
		});

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err);
	});
};

const getDailyWeather = info => {

	const { coords, timezone } = info;
	const DAILY_URL = `${ROOT_URL_DAILY}&lat=${coords.lat}&lon=${coords.lon}`;

	return getOpenWeatherMapData(DAILY_URL).then(forecast => {

		return forecast.list.map(day => {
	
			return {
				times: {
					day: timestampToLocalTime({ timestamp: day.dt, timezone, format:"MMM Do", needsUtc: true })
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
					text: capitalizeFirstLetter(day.weather[0].description),
					path: day.weather[0].icon
				}
			};
		});

	}).catch(err => {
		// Something went wrong, throw the error
		throw new Error(err);
	});
};


const capitalizeFirstLetter = str => {
	return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


const timestampToLocalTime = (options) => {

	let { timestamp, timezone, format, needsUtc } = options;
	
	let convertedTimestamp = timestamp + timezone.dstOffset + timezone.rawOffset;
	let unixTime = needsUtc ? moment.unix(convertedTimestamp).utc() : moment.unix(convertedTimestamp);

	return unixTime.format(format);
};

module.exports = {
	getCurrentWeather,
	getHourlyWeather,
	getDailyWeather
};