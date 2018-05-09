import axios from 'axios';

import "../config/config";

// Google URLs 
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY;
const TIMEZONE_ROOT_URL = `https://maps.googleapis.com/maps/api/timezone/json?key=${TIMEZONE_API_KEY}`;
const GEOCODE_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${TIMEZONE_API_KEY}&address=`;


/**  
 * Get location coordinates and name of a string location,
 * and then get the timezone information from the coordinates
 * @param {String} location - The string location
 * @returns {Promise}
 * */
const getLocationInfo = (location) => {

	// TODO: clean this up
	return new Promise((resolve, reject) => {

		// Get the coordinate info from a string location
		getLocationNameAndCoords(location).then(info => {
			
			// Now get the timezone data from this coordinate info
			getTimeZoneData(info.coords.lat, info.coords.lon).then(timezone => {

				// Everything is done.. resolve with the full object
				resolve({
					...info,
					timezone:{
						dstOffset: timezone.dstOffset,
						rawOffset: timezone.rawOffset,
						timeoneId: timezone.timeZoneId,
						timeZoneName: timezone.timeZoneName	
					}
				});
	
			});
		}).catch(err => {
			// Reject with the error
			reject(err);
		});
	});
};


/**  
 * API call to get location coordinates and name of location from a string location
 * @param {String} location - The string location
 * @returns {Promise}
 * */
const getLocationNameAndCoords = location => {

	// Encode location string
	let endcodedLocation = encodeURIComponent(location);

	return axios.get(GEOCODE_URL + endcodedLocation).then((res) => {

		// We didn't find anything
		if(res.data.status === "ZERO_RESULTS"){
			throw new Error("Unable to find that address.");
		}
		
		// Only return the first one
		return {
			name: res.data.results[0].formatted_address,
			coords: { 
				lat: res.data.results[0].geometry.location.lat,
				lon: res.data.results[0].geometry.location.lng
			}
		};

	}).catch(err => {
		// Throw error for the parent promise to catch
		throw new Error(err.response.data.message);
	});
}


/**  
 * API call to get timezone information from GPS coordinates
 * @param {String} location - The string location
 * @returns {Promise}
 * */
const getTimeZoneData = (lat, lon) => {

	// Get current timestamp
	let targetDate = new Date();
	let timestamp = targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
	
	// Create the API URL
	let TIMEZONE_URL = `${TIMEZONE_ROOT_URL}&location=${lat},${lon}&timestamp=${timestamp}`;

	return axios.get(TIMEZONE_URL).then(res => {
		// Invalid request, let the parent handle it
		if(res.data.status === "INVALID_REQUEST"){
			throw new Error("Invalid Request sent.");
		}

		// Return the timezone info
		return res.data;

	}).catch(e => {
		// Throw error for the parent promise to catch
		throw new Error(e);
	});
};

// Export
module.exports = {
	getLocationInfo
};