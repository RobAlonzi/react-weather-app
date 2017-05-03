import moment from "moment";
import Rainbow from 'rainbowvis.js';
import contrast from "contrast";

let timeZoneData = {};
let transitionTimeout;


let parseDailyTemp = (weather) => {
	return weather.map(day => {
		let snow = day.snow ? day.snow : undefined;
		let rain = day.rain ? day.rain : undefined;

		return {
			timeDay: convertTimeToLocalTimeAndFormat(day.dt, "MMM Do", true),
			clouds: day.clouds,
			humidity: day.humidity,
			rain,
			snow,
			tempMin: day.temp.min,
			tempMax: day.temp.max,
			weatherText: toProperCase(day.weather[0].description),
			icon: day.weather[0].icon
		};
	});
};

let parseHourlyTemp = (weather) => {

	return weather.map(hour => {
		let snow = hour.snow ? hour.snow["3h"] : undefined;
		let rain = hour.rain ? hour.rain["3h"] : undefined;
		return {
			timeHour: convertTimeToLocalTimeAndFormat(hour.dt, "h A", true),
			timeDay: convertTimeToLocalTimeAndFormat(hour.dt, "MMM Do", true),
			humidity: hour.main.humidity,
			temperature: hour.main.temp,
			clouds: hour.clouds.all,
			rain,
			snow,
			wind: hour.wind.speed,
			weatherText: toProperCase(hour.weather[0].description),
			icon: hour.weather[0].icon
		};
	});
};

let parseCurrentTemp = (weather) => {
	let weatherText = weather.weather.map(obj => {
		return {
			text: toProperCase(obj.description),
			icon: obj.icon
		};
	});

	return {
		time: convertTimeToLocalTimeAndFormat(undefined, "h:mm A"),
		lastUpd: convertTimeToLocalTimeAndFormat(weather.dt, "MMM do, h:mm A", true),
		temperature: weather.main.temp,
		humidity: weather.main.humidity,
		clouds: weather.clouds.all,
		wind: weather.wind.speed,
		sunrise: convertTimeToLocalTimeAndFormat(weather.sys.sunrise, "h:mm A", true),
		sunset: convertTimeToLocalTimeAndFormat(weather.sys.sunset, "h:mm A", true),
		weatherText: weatherText
	};
};

let setTimeZoneData = (data) => {
	timeZoneData = {
		dstOffset: data.dstOffset,
		rawOffset: data.rawOffset,
		timeoneId: data.timeoneId,
		timeZoneName: data.timeZoneName	
	};

	return timeZoneData;
};

let convertTimeToLocalTimeAndFormat = (timestamp, format, needsUtc) => {

	if(!timestamp){
		timestamp = getCurrentTime();
	}
	
	let convertedTimestamp = timestamp + timeZoneData.dstOffset + timeZoneData.rawOffset;
	return !needsUtc ? moment.unix(convertedTimestamp).format(format) : moment.unix(convertedTimestamp).utc().format(format);
};


let setBackgroundColor = (weather) => {
	const MidnightToNoon = ["001848", "301860", "483078", "604878",  "906090", "bea9de", "9AC1D9", "9CC8D9", "91BAD6"];
	const NoonToMidnight = MidnightToNoon.slice(0).reverse();

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

function getCurrentTime(){
	let targetDate = new Date();
	return targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
}

function transitionToBackground(oldColor, newColor){
	const rainbowTransition = new Rainbow();
	rainbowTransition.setNumberRange(1, 250);
	rainbowTransition.setSpectrum(newColor, oldColor);
	
	return function transitionLoop(i) {
		transitionTimeout = setTimeout(function () {   
			document.body.style.backgroundColor = `#${rainbowTransition.colorAt(i)}`;
			document.body.classList.remove("light-font-color");
			document.body.classList.remove("dark-font-color");

			let fontColor = contrast(rainbowTransition.colorAt(i)) === 'light' ? 'dark-font-color' : 'light-font-color';
			
			document.body.classList.add(fontColor);               
			if (--i) transitionLoop(i);    
		}, 0);
	}; 
}

function rgb2hex(rgb){
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function toProperCase(str){
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


module.exports = {
	parseDailyTemp,
	parseHourlyTemp,
	parseCurrentTemp,
	setTimeZoneData,
	convertTimeToLocalTimeAndFormat,
	setBackgroundColor
};