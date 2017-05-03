import React, { Component } from "react";
import _ from "lodash";


import * as Fetch from "../api/fetchCalls";
import { convertTimeToLocalTimeAndFormat, setBackgroundColor } from "../api/utilities";
import WeatherSearch from "./WeatherSearch";
import WeatherText from "./WeatherText";
import WeatherForcastList from "./WeatherForcastList";

import "./AppContainer.scss";

class AppContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			searchText: "",
			city: {
				name:"",
				lat:"",
				lon:""
			},
			currentWeather: {},
			dailyWeather:[],
			hourlyWeather:[],
			isLoading: false,
			errorMessage: "",
			backgroundColor: "#FFF"
		};		

		this.handleSearch = this.handleSearch.bind(this);
		this.getDailyForecast = this.getDailyForecast.bind(this);
		this.getHourlyForecast = this.getHourlyForecast.bind(this);
		this.getCurrentForecast = this.getCurrentForecast.bind(this);
		this.configureTimezone = this.configureTimezone.bind(this);

		this.startTimers();
	}

	componentWillUpdate(nextProps, nextState){
		if(nextState.currentWeather.time !== this.state.currentWeather.time){
			let backgroundColor = setBackgroundColor(nextState.currentWeather);

			this.setState({
				backgroundColor
			});
		}
	}

	startTimers(){
		//every 10 minutes get weather
		setInterval(() =>{
			if(this.state.city.lat && this.state.city.lon){
				this.getCurrentForecast();
				this.getDailyForecast();
				this.getHourlyForecast();
			}
		}, 600000);

		//every minute get time
		setInterval(() =>{
			if(this.state.city.lat && this.state.city.lon){
				let time = convertTimeToLocalTimeAndFormat(undefined, "h:mm A");

				let newCurrentWeather = _.extend({}, this.state.currentWeather);
				newCurrentWeather.time = time;

				this.setState({currentWeather:newCurrentWeather});
			}
		}, 60000);
	}
	
	handleSearch(location){
		this.setState({searchText: location, isLoading:true});

		Fetch.getLocationCoords(location).then(coords => {

			this.setState({
				city : {
					name: coords.name,
					lat: coords.lat,
					lon: coords.lon
				}
			});

			this.configureTimezone().then(() => {
				Promise.all([this.getCurrentForecast(),this.getDailyForecast(), this.getHourlyForecast()]).then(() => {
					this.setState({isLoading:false});
				});
			});

		}).catch(e => {this.setState({isLoading: false, errorMessage: e.message});});
	}

	configureTimezone(){
		return Fetch.getTimeZoneData(this.state.city.lat, this.state.city.lon);
	}

	getDailyForecast(){
		return Fetch.getDailyTemp(this.state.city.lat, this.state.city.lon).then(dailyWeather => {
			this.setState({dailyWeather});
		}).catch(err => {this.setState({errorMessage: err});});
	}


	getHourlyForecast(){
		return Fetch.getHourlyTemp(this.state.city.lat, this.state.city.lon).then(hourlyWeather => {
			this.setState({hourlyWeather});
		}).catch(err => {this.setState({errorMessage: err});});
	}

	getCurrentForecast(){
		return Fetch.getCurrentTemp(this.state.city.lat, this.state.city.lon).then(currentWeather => {
			this.setState({currentWeather});
		}).catch(err => {this.setState({errorMessage: err});});
	}



	render(){
		let { isLoading, city, currentWeather, hourlyWeather, dailyWeather, errorMessage } = this.state;
		return (
			<div>
				
				{ 	
					isLoading ?
					<div className="container loading-dialog">
						<div className="row">
							<div className="col">
								<p>Loading...</p>
								<i className="ion-load-a"></i>
							</div>
						</div>
					</div>		
					: Object.keys(city).length > 0 && Object.keys(currentWeather).length > 0 && !errorMessage ? 
					<span>
					<WeatherSearch onSearch={this.handleSearch} />
					<WeatherText city={city.name} weather={currentWeather}/>
					<WeatherForcastList hourly={hourlyWeather} daily={dailyWeather} />
					</span>
					: 
					<div className="container landing-page-search">
						<div className="row">
							<div className="col">
								<p>Search the weather in any city....</p>
								<WeatherSearch onSearch={this.handleSearch} />
							</div>	
						</div>
					</div>
				}
				{
					!isLoading ?
					<div className="container city-examples">
						<div className="row">
							<div className="col">
								<p>Examples</p>
								<ol>
									<li><a onClick={() => this.handleSearch("Toronto, Canada")} href="javascript:;">Toronto, Canada</a></li>
									<li><a onClick={() => this.handleSearch("Montevideo, Uruguay")} href="javascript:;">Montevideo, Uruguay</a></li>
									<li><a onClick={() => this.handleSearch("Tokyo, Japan")} href="javascript:;">Tokyo, Japan</a></li>
									<li><a onClick={() => this.handleSearch("Rome, Italy")} href="javascript:;">Rome, Italy</a></li>
								</ol>
							</div>	
						</div>	
					</div>
					: null
				}
			</div>
		);
	}
}

export default AppContainer;
