import moment from "moment";

/**  
 * Gets the current timestamp
 * @returns {Number}
 * */
const getCurrentTimestamp = () => {
	let targetDate = new Date();
	return targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
}


/**  
 * Converts given timestamp to the desired moment format text depending on the timezone
 * @param {Object} options
 * @returns {String}
 * */
const timestampToLocalTime = (options) => {

	let { timestamp, timezone, format, needsUtc } = options;
	
	// Convert UTC timestamp to local timezone
	let convertedTimestamp = timestamp + timezone.dstOffset + timezone.rawOffset;

	// Convert timestamp to UNIX with moment
	let unixTime = needsUtc ? moment.unix(convertedTimestamp).utc() : moment.unix(convertedTimestamp);

	// Return formatted time
	return unixTime.format(format);
};

/**  
 * Given a string, matches whole words and capitalizes the first letter in each
 * @param {String} str
 * @returns {String}
 * */
const capitalizeFirstLetter = str => {
	return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**  
 * Given an rgb value, will convert to a hex value
 * https://gist.github.com/sabman/1018593
 * @param {String} rgb
 * @returns {String}
 * */
const rgb2hex = rgb => {
	const hex = x => ('0' + parseInt(x).toString(16)).slice(-2);
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return `#${hex(rgb[1])}${hex(rgb[2])}${hex(rgb[3])}`;
}

// Export
module.exports = {
	getCurrentTimestamp,
	timestampToLocalTime,
	capitalizeFirstLetter,
	rgb2hex
};