import React, { Component } from "react";
import _ from "lodash";
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper';

import * as Fetch from "../api/fetchCalls";
import { convertTimeToLocalTimeAndFormat, setBackgroundColor } from "../api/utilities";

import Loading from "./Loading";
import Examples from "./Examples";
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
			errorMessage: null,
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
		this.setState({searchText: location, isLoading:true, errorMessage: null});

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
			<Grid container justify="center">
				
				{isLoading ?

					<Grid item xs={8}>
						<Loading />	
					</Grid>
						
					: Object.keys(city).length > 0 && Object.keys(currentWeather).length > 0 && !errorMessage ? 
					

					<Grid item xs={11} md={8}>
						<Grid item xs={12} alignContent="flex-end">
							<WeatherSearch onSearch={this.handleSearch} />
						</Grid>
						<Grid item xs={12}>
							<WeatherText city={city.name} weather={currentWeather}/>
							<WeatherForcastList hourly={hourlyWeather} daily={dailyWeather} />
							<Examples handleSearch={this.handleSearch} />
						</Grid>
					</Grid>
					

					:

					<Grid item xs={12} md={8}>
						<Grid item xs={12}>
							<WeatherSearch onSearch={this.handleSearch} isLandingPage={true}/>
						</Grid>

						<Grid item xs={12}>
							<Examples handleSearch={this.handleSearch} />
						</Grid>
					</Grid>
				}
			</Grid>
		);
	}
}

export default AppContainer;
