import Rainbow from 'rainbowvis.js';
import contrast from "contrast";

let transitionTimeout;


const getCurrentTimestamp = () => {
	let targetDate = new Date();
	return targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
}




const setBackgroundColor = (weather) => {
	let MidnightToNoon = ["001848", "301860", "483078", "604878", "9AC1D9", "9CC8D9", "91BAD6"];
	let NoonToMidnight = MidnightToNoon.slice(0).reverse();
	
	MidnightToNoon.splice(1, 0, "003194");

	let timeArr = weather.time.slice(0, -3).split(":").map(time => {
		return time === "12" ? 0 : parseInt(time);
	});

	let AMPM = weather.time.split(" ")[1].trim();
	let colorPalette = AMPM === "AM" ? MidnightToNoon : NoonToMidnight;
	
	const rainbow = new Rainbow();
	rainbow.setNumberRange(1, 720);
	rainbow.setSpectrum(...colorPalette);

	let colorIndex = (timeArr[0] * 60 + timeArr[1] );
	let colorToUse = `#${rainbow.colorAt(colorIndex)}`;

	//DOM Manipulation
	let currentColor = document.body.style.backgroundColor || "rgb(255,255,255)";

	let startTransition = transitionToBackground(rgb2hex(currentColor), colorToUse);
	clearTimeout(transitionTimeout);
	startTransition(250);
	
	return colorToUse;

}; 


const transitionToBackground = (oldColor, newColor) => {
	const rainbowTransition = new Rainbow();
	rainbowTransition.setNumberRange(1, 250);
	rainbowTransition.setSpectrum(newColor, oldColor);
	
	return function transitionLoop(i) {
		transitionTimeout = setTimeout(function () {   
			document.body.style.backgroundColor = `#${rainbowTransition.colorAt(i)}`;

			let fontColor = contrast(rainbowTransition.colorAt(i)) === 'light' ? 'dark-font-color' : 'light-font-color';

			if(!document.body.classList.contains(fontColor)){
				document.body.classList.remove("light-font-color");
				document.body.classList.remove("dark-font-color");
				document.body.classList.add(fontColor);    
			}
           
			if (--i) transitionLoop(i);    
		}, 0);
	}; 
}

const rgb2hex = rgb => {
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}




module.exports = {
	setBackgroundColor,
	getCurrentTimestamp
};