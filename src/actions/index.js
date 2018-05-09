
import * as OpenWeatherAPI from "../api/OpenWeather";
import * as GoogleAPI from "../api/Google";
import { 
	TOGGLE_PAGE_LOADING, 
	SET_LOCATION_NAME,
	SET_LOCATION_COORDS,
	SET_LOCATION_TIMEZONE,
	SET_CURRENT_WEATHER_FORECAST,
	SET_HOURLY_WEATHER_FORECAST,
	SET_DAILY_WEATHER_FORECAST,
	SET_ACTIVE_FORECAST_DAILY,
	SET_ACTIVE_FORECAST_HOURLY
} from './types';



function togglePageLoading(){
	return {
		type: TOGGLE_PAGE_LOADING
	}
}

function setIsWeatherLoaded(){
	return {
		type: SET_IS_WEATHER_LOADED
	}
}

function setLocationName(name){
	return {
		type: SET_LOCATION_NAME,
		payload: name
	}
}

function setLocationCoords(coords){
	return {
		type: SET_LOCATION_COORDS,
		payload: coords
	}
}

function setLocationTimezone(timezone){
	return {
		type: SET_LOCATION_TIMEZONE,
		payload: timezone
	}
}

function setLocationForecast(forecast){
	return {
		type: SET_LOCATION_FORECAST,
		payload: forecast
	}
}

function setCurrentWeatherForecast(forecast){
	return {
		type: SET_CURRENT_WEATHER_FORECAST,
		payload: forecast
	}
}

function setHourlyWeatherForecast(forecast){
	return {
		type: SET_HOURLY_WEATHER_FORECAST,
		payload: forecast
	}
}

function setDailyWeatherForecast(forecast){
	return {
		type: SET_DAILY_WEATHER_FORECAST,
		payload: forecast
	}
}

export function switchToDaily(){
	return {
		type: SET_ACTIVE_FORECAST_DAILY
	}
}

export function switchToHourly(){
	return {
		type: SET_ACTIVE_FORECAST_HOURLY
	}
}

/**  
 * Action dispatcher to get all the weather info needed to load the app
 * @param {String} location - The string location
 * @returns {Function}
 * */
export function handleSearch(location){

	return dispatch => {

		// Tell the page we are loading
		dispatch(togglePageLoading());

		// Use the typed location to get all the info about the location
		GoogleAPI.getLocationInfo(location).then(info => {

			// Set location name, lat/lon info, and timezone info
			dispatch(setLocationName(info.name));
			dispatch(setLocationCoords(info.coords));
			dispatch(setLocationTimezone(info.timezone));

			// Get the weather info
			dispatch(getForecasts());

			// We're done loading everything!
			dispatch(togglePageLoading());

		}).catch(e => {

			// Loading is done (because of an error)
			dispatch(togglePageLoading());
			
			// Set Error Message
		});
	}
}


function getForecasts(){
	// Dispatch the individual weather requests
	return dispatch => {
		dispatch(getCurrentWeatherForecast());
		dispatch(getHourlyWeatherForecast());
		dispatch(getDailyWeatherForecast());
	}
}


function getCurrentWeatherForecast(){
	return (dispatch, getState) => {

		const { location } = getState();

		OpenWeatherAPI.getCurrentWeather(location).then(forecast => {
			dispatch(setCurrentWeatherForecast(forecast));
		});
	}
}


function getHourlyWeatherForecast(){
	return (dispatch, getState) => {

		const { location } = getState();

		OpenWeatherAPI.getHourlyWeather(location).then(forecast => {
			dispatch(setHourlyWeatherForecast(forecast));
		});
	}
}


function getDailyWeatherForecast(){
	return (dispatch, getState) => {

		const { location } = getState();

		OpenWeatherAPI.getDailyWeather(location).then(forecast => {
			dispatch(setDailyWeatherForecast(forecast));
		});
	}
}