var axios = require("axios");

import * as Utils from "./utilities";
import "../config/config";

// OPEN WEATHER MAP 
const API_KEY = process.env.API_KEY;
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY;
const TIMEZONE_ROOT_URL = `https://maps.googleapis.com/maps/api/timezone/json?key=${TIMEZONE_API_KEY}`;
const ROOT_URL_DAILY = `http://api.openweathermap.org/data/2.5/forecast/daily?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_HOURLY = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&cnt=5`;
const ROOT_URL_CURRENT = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;

let getLocationCoords = (location) => {
	let endcodedLocation = encodeURIComponent(location);
	let geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${endcodedLocation}`;

	return axios.get(geocodeURL).then((res) => {
		if(res.data.status === "ZERO_RESULTS")
			throw new Error("Unable to find that address.");

		return {
			name: res.data.results[0].formatted_address,
			lat: res.data.results[0].geometry.location.lat,
			lon: res.data.results[0].geometry.location.lng
		};

	}).catch(err => {
		throw new Error(err.response.data.message);
	});
};


let getDailyTemp = (lat, lon) => {
	const DAILY_URL = `${ROOT_URL_DAILY}&lat=${lat}&lon=${lon}`;

	return getOpenWeatherMapData(DAILY_URL).then(weather => {
		return Utils.parseDailyTemp(weather.list);
	}).catch(err => {
		return err;
	});
};


let getHourlyTemp = (lat, lon) => {
	const HOURLY_URL = `${ROOT_URL_HOURLY}&lat=${lat}&lon=${lon}`;
	return getOpenWeatherMapData(HOURLY_URL).then(weather => {
		return Utils.parseHourlyTemp(weather.list);
	}).catch(err => {
		return err;
	});
};

let getCurrentTemp = (lat, lon) => {
	const CURRENT_URL = `${ROOT_URL_CURRENT}&lat=${lat}&lon=${lon}`;
	return getOpenWeatherMapData(CURRENT_URL).then(weather => {
		return Utils.parseCurrentTemp(weather);
	}).catch(err => {
		return err;
	});
};

function getOpenWeatherMapData(URL){
	return axios.get(URL).then(res => {
		if(res.data.cod !== "200" && res.data.cod !== 200){
			throw new Error(res.data.message);
		}else{
			return res.data;
		}
	}).catch(err => {
		throw new Error(err.data.message);
	});

}

let getTimeZoneData = (lat, lon) => {
	let targetDate = new Date();
	let timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;

	let TIMEZONE_URL = `${TIMEZONE_ROOT_URL}&location=${lat},${lon}&timestamp=${timestamp}`;

	return axios.get(TIMEZONE_URL).then(res => {
		if(res.data.status === "INVALID_REQUEST"){
			throw new Error("Invalid Request sent.");
		}else{
			return Utils.setTimeZoneData(res.data);
		}
	}).catch(e => {
		throw new Error(e);
	});
};


module.exports = {
	getLocationCoords,
	getDailyTemp,
	getHourlyTemp,
	getCurrentTemp,
	getTimeZoneData
};