import React from "react";
import ReactDOM from "react-dom";
import { Route, Router, IndexRoute, hashHistory } from "react-router";

import AppContainer from "./components/AppContainer";

import "../css/style.scss";

ReactDOM.render(
	<AppContainer />,
	document.getElementById('root')
);