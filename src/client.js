import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import CssBaseline from 'material-ui/CssBaseline';

import reducers from "./reducers";
import AppContainer from "./components/AppContainer";
import "./css/style.scss";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

ReactDOM.render(
	<Provider store={store}>
		<React.Fragment>
			<CssBaseline />
			<AppContainer />
		</React.Fragment>
	</Provider>,
	document.getElementById('root')
);