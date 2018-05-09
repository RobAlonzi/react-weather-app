import React from 'react';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

import '../css/Loading.scss';

/**  
 * Component that will create the loading indicator
 * @returns {Function}
 * */
const Loading = () => {
	return (
		<Grid className="loading-container" container justify="center">
			<CircularProgress />
		</Grid>	
	);
};

export default Loading;