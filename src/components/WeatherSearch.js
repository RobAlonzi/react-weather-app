import React, { Component } from "react";
import PropTypes from 'prop-types';

import "./WeatherSearch.scss";

class WeatherSearch extends Component{
	constructor(props) {
		super(props);
		this.onSearch = this.onSearch.bind(this);
	}

	onSearch(e){
		e.preventDefault();
		let location = this.refs.search.value;
		
		if(location.length > 0){
			this.refs.search.value = "";
			this.props.onSearch(location);
		}
	}

	render(){
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="search-container col">
						<form onSubmit={this.onSearch} className="float-right">
							<ul className="menu nav">
								<li>
									<div className="input-group">
										<input className="form-control" type="text" placeholder="Search Weather by city" ref="search" />
									</div>
								</li>
								<li>
									<div className="input-group">
										<input type="submit" className="form-control btn btn-outline-primary" value="Get Weather" />
									</div>
								</li>
							</ul>
						</form>
					</div>
				</div>	
			</div>
		);
	}
}

WeatherSearch.PropTypes = {
	onSearch: PropTypes.func.isRequired
};

export default WeatherSearch;
