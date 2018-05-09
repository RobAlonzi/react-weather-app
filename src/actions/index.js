
import * as OpenWeatherAPI from "../api/OpenWeather";
import * as GoogleAPI from "../api/Google";
import * as BackgroundColor from "../helpers/BackgroundColor";
import * as Utility from "../helpers/Utilities";
import { 
	TOGGLE_PAGE_LOADING, 
	SET_LOCATION_NAME,
	SET_LOCATION_COORDS,
	SET_LOCATION_TIMEZONE,
	SET_CURRENT_WEATHER_FORECAST,
	SET_HOURLY_WEATHER_FORECAST,
	SET_DAILY_WEATHER_FORECAST,
	SET_ACTIVE_FORECAST_DAILY,
	SET_ACTIVE_FORECAST_HOURLY,
	SET_UPDATED_TIME,
	SET_TIMERS_ACTIVATED,
	CLEAR_PREVIOUS_SEARCH_INFO
} from './types';


/**  
 * Action dispatcher to toggle the loading state
 * @returns {Function}
 * */
export function togglePageLoading(){
	return {
		type: TOGGLE_PAGE_LOADING
	}
}

/**  
 * Action dispatcher to set that all the weather forecasts are retrieved from the API
 * @returns {Function}
 * */
function setIsWeatherLoaded(){
	return {
		type: SET_IS_WEATHER_LOADED
	}
}

/**  
 * Action dispatcher to set the name (from Google) of the location the user searched
 * @param {String} name - The location as returned from Google
 * @returns {Function}
 * */
function setLocationName(name){
	return {
		type: SET_LOCATION_NAME,
		payload: name
	}
}

/**  
 * Action dispatcher to set the GPS coordinates of the location searched
 * @param {Object} coords - GPS coordinates of the location searched
 * @returns {Function}
 * */
function setLocationCoords(coords){
	return {
		type: SET_LOCATION_COORDS,
		payload: coords
	}
}

/**  
 * Action dispatcher to set the timezone info of the location searched
 * @param {Object} timezone - Timezone info of the location searched
 * @returns {Function}
 * */
function setLocationTimezone(timezone){
	return {
		type: SET_LOCATION_TIMEZONE,
		payload: timezone
	}
}

/**  
 * Action dispatcher to set the current weather forecast (from OpenWeather) of the location searched
 * @param {Object} forecast - Current weather forecast
 * @returns {Function}
 * */
function setCurrentWeatherForecast(forecast){
	return {
		type: SET_CURRENT_WEATHER_FORECAST,
		payload: forecast
	}
}

/**  
 * Action dispatcher to set the hourly weather forecast (from OpenWeather) of the location searched
 * @param {Object[]} forecast - Hourly weather forecast
 * @returns {Function}
 * */
function setHourlyWeatherForecast(forecast){
	return {
		type: SET_HOURLY_WEATHER_FORECAST,
		payload: forecast
	}
}

/**  
 * Action dispatcher to set the daily weather forecast (from OpenWeather) of the location searched
 * @param {Object[]} forecast - Daily weather forecast
 * @returns {Function}
 * */
function setDailyWeatherForecast(forecast){
	return {
		type: SET_DAILY_WEATHER_FORECAST,
		payload: forecast
	}
}

/**  
 * Action dispatcher to set the current local time (based off timezone info from Google) of the location searched
 * @param {string} time - The string value (h:mm A) [ex: 10:15 AM] of the current local time 
 * @returns {Function}
 * */
function setUpdatedTime(time){
	return {
		type: SET_UPDATED_TIME,
		payload: time
	}
}

/**  
 * Action dispatcher to tell the app we have already started the interval timers
 * @returns {Function}
 * */
function setTimersActivated(){
	return {
		type: SET_TIMERS_ACTIVATED
	}
}

/**  
 * Action dispatcher to remove the previous search weather information 
 * @returns {Function}
 * */
function clearPreviousSearchInfo(){
	return {
		type: CLEAR_PREVIOUS_SEARCH_INFO
	}
}

/**  
 * Action dispatcher to set the active view panel to 'Daily'
 * @returns {Function}
 * */
export function switchToDaily(){
	return {
		type: SET_ACTIVE_FORECAST_DAILY
	}
}

/**  
 * Action dispatcher to set the active view panel to 'Hourly'
 * @returns {Function}
 * */
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

		// Tell the page we are loading, clear the previous info 
		dispatch(togglePageLoading());
		dispatch(clearPreviousSearchInfo());

		// Use the typed location to get all the info about the location
		GoogleAPI.getLocationInfo(location).then(info => {

			// Set location name, lat/lon info, and timezone info
			dispatch(setLocationName(info.name));
			dispatch(setLocationCoords(info.coords));
			dispatch(setLocationTimezone(info.timezone));

			// Get the weather info
			dispatch(getForecasts());

		}).catch(e => {

			// Loading is done (because of an error)
			dispatch(togglePageLoading());
			
			// TODO: Set Error Message
		});
	}
}

/**  
 * Updates the local current time of the location (used in the interval)
 * @returns {Function}
 * */
function updateTime(){
	return (dispatch, getState) => {

		const { location, isLoading } = getState();

		// If we're not loading, and we have a populated location object
		if(!isLoading && Object.keys(location).length !== 0){

			// Get the current timestamp, and convert it to the location's local time
			const localTime = Utility.timestampToLocalTime({ timestamp: Utility.getCurrentTimestamp(), timezone: location.timezone, format:"h:mm A", needsUtc: false });
			
			// Dispatch the new time, change the background color
			dispatch(setUpdatedTime(localTime));
			BackgroundColor.setBackgroundColor(localTime);
		}
	}
}

/**  
 * Dispatches the various actions to get the current, daily and hourly forecasts
 * @returns {Function}
 * */
function getForecasts(){
	return dispatch => {
		// Dispatch the individual weather requests
		dispatch(getCurrentWeatherForecast());
		dispatch(getHourlyWeatherForecast());
		dispatch(getDailyWeatherForecast());
	}
}

/**  
 * Use OpenWeatherAPI to get the current weather forecast
 * @returns {Function}
 * */
function getCurrentWeatherForecast(){
	return (dispatch, getState) => {
		
		// We need the location info from state
		const { location } = getState();

		OpenWeatherAPI.getCurrentWeather(location).then(forecast => {
			// Dispatch the result to the state
			dispatch(setCurrentWeatherForecast(forecast));
			// Change the background color based on the current local time
			BackgroundColor.setBackgroundColor(forecast.times.current);
		});
	}
}

/**  
 * Use OpenWeatherAPI to get the hourly weather forecast
 * @returns {Function}
 * */
function getHourlyWeatherForecast(){
	return (dispatch, getState) => {

		// We need the location info from state
		const { location } = getState();

		OpenWeatherAPI.getHourlyWeather(location).then(forecast => {
			// Dispatch the result to the state
			dispatch(setHourlyWeatherForecast(forecast));
		});
	}
}

/**  
 * Use OpenWeatherAPI to get the daily weather forecast
 * @returns {Function}
 * */
function getDailyWeatherForecast(){
	return (dispatch, getState) => {

		// We need the location info from state
		const { location } = getState();

		OpenWeatherAPI.getDailyWeather(location).then(forecast => {
			// Dispatch the result to the state
			dispatch(setDailyWeatherForecast(forecast));
		});
	}
}


/**  
 * Creates intervals to re-fetch time and weather data
 * @returns {Function}
 * */
export function activateTimers(){

	return dispatch => {

		// Every 10 minutes, re-fetch weather data
		setInterval(() => getForecasts(), 600000);

		// Every minute, update the current local time
		setInterval(() => updateTime(), 60000);

		// Let state know these are already created
		dispatch(setTimersActivated())
	}	
}
