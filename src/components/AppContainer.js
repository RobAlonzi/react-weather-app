import 'babel-polyfill';
import React, { Component } from "react";
import _ from "lodash";
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';

import { setBackgroundColor } from "../api/utilities";

import { handleSearch, switchToDaily, switchToHourly } from "../actions/index";

import Loading from "./Loading";
import Examples from "./Examples";
import WeatherSearch from "./WeatherSearch";
import CurrentWeather from "./CurrentWeather";
import ForecastPanel from "./ForecastPanel";
import HourlyForecastList from "./HourlyForecastList";
import DailyForecastList from "./DailyForecastList";

import "../css/AppContainer.scss";

class AppContainer extends Component{

	componentDidMount(){

		//TODO: add background change functionality

		// let { location: { timezone }} = this.props;

		// //every 10 minutes get weather
		// setInterval(() =>{
		// 	if(timezone.lat && timezone.lon){
		// 		// Get new weather
		// 	}
		// }, 600000);

		// //every minute get time
		// setInterval(() =>{

		// 	if(timezone.lat && timezone.lon){
		// 		let time = convertTimeToLocalTimeAndFormat(undefined, "h:mm A");

		// 		// Set time
		// 	}
		// }, 60000);
	}


	render(){
		let { isLoading, isWeatherLoaded, error, location, forecast, activePanel } = this.props.weather;
		return (
			<Grid container justify="center">
				
				{isLoading ?

					<Grid item xs={8}>
						<Loading />	
					</Grid>
						
				: forecast.current && forecast.hourly && forecast.daily && !error ? 
					
					<Grid item xs={11} md={8}>
						<Grid item xs={12}>
							<WeatherSearch onSearch={this.props.handleSearch} />
						</Grid>
						<Grid item xs={12}>
							<CurrentWeather city={location.name} forecast={forecast.current}/>

							{ activePanel === 'hourly' ?
								<ForecastPanel title="Hourly" switchTxt="daily" handleSwitch={this.props.switchToDaily}>
									<HourlyForecastList forecasts={forecast.hourly} />
								</ForecastPanel>
							:
								<ForecastPanel title="Daily" switchTxt="hourly" handleSwitch={this.props.switchToHourly}>
									<DailyForecastList forecasts={forecast.daily} />
								</ForecastPanel>
							}
							
							<Examples handleSearch={this.props.handleSearch} />
						</Grid>
					</Grid>

				:

					<Grid item xs={12} md={8}>
						<Grid item xs={12}>
							<WeatherSearch onSearch={this.props.handleSearch} isLandingPage={true}/>
						</Grid>

						<Grid item xs={12}>
							<Examples handleSearch={this.props.handleSearch} />
						</Grid>
					</Grid>
				}
			</Grid>
		);
	}
}

function mapStateToProps(state){
	return {
		weather: state
	}
}

export default connect(mapStateToProps, { handleSearch, switchToDaily, switchToHourly })(AppContainer);
