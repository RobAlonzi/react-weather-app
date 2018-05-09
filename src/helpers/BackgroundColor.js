import Rainbow from 'rainbowvis.js';
import contrast from "contrast";

import * as Utility from "./Utilities";

// Color Range Arrays
const AM_COLOR_RANGE = ["001848", "003194", "301860", "483078", "604878", "9AC1D9", "9CC8D9", "91BAD6"];
const PM_COLOR_RANGE = ["91BAD6", "9CC8D9", "9AC1D9", "604878", "483078", "301860", "001848"];

const RainbowTransition = new Rainbow();
let transitionTimeout;

/**  
 * Given a time, this will update the body background color to an appropriate color.
 * It updates by transitioning to the starting color and ending at the ending color
 * The colors are determined with the rainbowvis.js package, which creates a range of all the colors between a given array of colors
 * A timeout is created that quickly transitions the body background color from the start color all the way through to the end color
 * @param {String} time - The string value (h:mm A) [ex: 10:15 AM] of the current local time 
 * */
const setBackgroundColor = (time) => {

	// Turns a string time into an array of numbers (removes the AM/PM text before)
	let timeArr = time.slice(0, -3).split(":").map(item => {
		// If it is 12, change to 0
		return item === "12" ? 0 : parseInt(item);
	});

	// Take the AM/PM text out of the time
	let AMPM = time.split(" ")[1].trim();
	
	// Set the number range on the rainbowvis, as well as the spectrum (depending on AM or PM)
	RainbowTransition.setNumberRange(1, 720);
	RainbowTransition.setSpectrum(...(AMPM === "AM" ? AM_COLOR_RANGE : PM_COLOR_RANGE));

	// Hour * 60 plus minutes to figure out where on the spectrum we are
	let colorIndex = (timeArr[0] * 60 + timeArr[1] );
	let colorToUse = `#${RainbowTransition.colorAt(colorIndex)}`;

	// Get the current color, or use white
	let currentColor = document.body.style.backgroundColor || "rgb(255,255,255)";

	// Create the transition, and let it run 250 times
	transitionToBackground(Utility.rgb2hex(currentColor), colorToUse)(250);
}; 


/**  
 * Given a start and ending color, this will quickly change the background color of the body to every color in the spectrum between the two colors.
 * @param {String} startColor - HEX value of the starting color
 * @param {String} endColor - HEX value of the ending color
 * @returns {Function}
 * */
const transitionToBackground = (startColor, endColor) => {

	// If a timeout already exists, stop it
	clearTimeout(transitionTimeout);

	// Set the new number range and spectrum of the rainbowvis
	RainbowTransition.setNumberRange(1, 250);
	RainbowTransition.setSpectrum(endColor, startColor);
	
	// Return the closure
	return function transitionLoop(i) {

		// Create the timeout
		transitionTimeout = setTimeout(function () {
			
			// Change the background color to the new color in the spectrum 
			document.body.style.backgroundColor = `#${RainbowTransition.colorAt(i)}`;

			// Find out if the background is a light or dark color, via a contrast package
			let fontColor = contrast(RainbowTransition.colorAt(i)) === 'light' ? 'dark-font-color' : 'light-font-color';

			// If the body doesn't already have this font-color class, add it (and remove the other)
			if(!document.body.classList.contains(fontColor)){
				document.body.classList.remove("light-font-color");
				document.body.classList.remove("dark-font-color");
				document.body.classList.add(fontColor);    
			}

			// Run this again until i hits 0
			if (--i) transitionLoop(i);    
		}, 0);
	}; 
}

// Export
module.exports = {
	setBackgroundColor
};