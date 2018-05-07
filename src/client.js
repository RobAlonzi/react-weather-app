import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from 'material-ui/CssBaseline';

import AppContainer from "./components/AppContainer";
import "./style.scss";

ReactDOM.render(
	<React.Fragment>
		<CssBaseline />
		<AppContainer />
    </React.Fragment>,
	document.getElementById('root')
);