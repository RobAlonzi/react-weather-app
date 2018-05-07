import React, { Component } from "react";
import Grid from "material-ui/Grid";
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';

import "./WeatherSearch.scss";

class WeatherSearch extends Component{
	constructor(props) {
		super(props);
		
		this.state = { searchValue: "" };

		this.onSearch = this.onSearch.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	onInputChange(e){
		this.setState({ searchValue: e.target.value });
	}

	onSearch(e){
		e.preventDefault();

		let location = this.state.searchValue;
		
		if(location.length > 0){
			this.setState({ searchValue: "" });
			this.props.onSearch(location);
		}
	}

	render(){
		return (
			<Grid item xs={12} className={`${this.props.isLandingPage ? "landing-page-search" : ""} search-container`}>
				{ this.props.isLandingPage ? <p> Search the weather in any city.... </p> : null }
				<form onSubmit={this.onSearch}>
					<Input className="search-input" placeholder="Search Weather by city" onChange={this.onInputChange} />
					<Button variant="raised" type="submit" color="primary" >Get Weather</Button>
				</form>
			</Grid>
		);
	}
}

WeatherSearch.propTypes = {
	onSearch: PropTypes.func.isRequired
};

export default WeatherSearch;
