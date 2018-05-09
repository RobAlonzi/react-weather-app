import { 
	TOGGLE_PAGE_LOADING, 
	SET_LOCATION_NAME,
	SET_LOCATION_COORDS,
	SET_LOCATION_TIMEZONE,
	SET_CURRENT_WEATHER_FORECAST, 
	SET_HOURLY_WEATHER_FORECAST, 
	SET_DAILY_WEATHER_FORECAST, 
	SET_ACTIVE_FORECAST_DAILY,
	SET_ACTIVE_FORECAST_HOURLY,
	SET_UPDATED_TIME,
	SET_TIMERS_ACTIVATED,
	CLEAR_PREVIOUS_SEARCH_INFO
} from "../actions/types";

const initialState = {
	activePanel: '',
	isLoading: false,
	error: null,
	location: {},
	forecast: {},
	timersActivated: false
};

const reducer = (state = initialState, action) => {
	switch(action.type){
		case TOGGLE_PAGE_LOADING:
			return { ...state, isLoading: !state.isLoading }
		case SET_LOCATION_NAME:
			return { ...state, location: { ...state.location, name: action.payload }};
		case SET_LOCATION_COORDS:
			return { ...state, location: { ...state.location, coords: action.payload }};
		case SET_LOCATION_TIMEZONE:
			return { ...state, location: { ...state.location, timezone: action.payload }};		
		case SET_CURRENT_WEATHER_FORECAST:
			return { ...state, forecast: { ...state.forecast, current: action.payload }};
		case SET_UPDATED_TIME:
			return { ...state, forecast: { ...state.forecast, current: {...state.forecast.current, times: { ...state.forecast.current.times, current: action.payload }} }};	
		case SET_HOURLY_WEATHER_FORECAST:
			return { ...state, forecast: { ...state.forecast, hourly: action.payload }};
		case SET_DAILY_WEATHER_FORECAST:
			return { ...state, forecast: { ...state.forecast, daily: action.payload }};		
		case SET_ACTIVE_FORECAST_DAILY:
			return { ...state, activePanel: 'daily' };
		case SET_ACTIVE_FORECAST_HOURLY:
			return { ...state, activePanel: 'hourly' };
		case SET_TIMERS_ACTIVATED:
			return { ...state, timersActivated: true };	
		case CLEAR_PREVIOUS_SEARCH_INFO:
			return { ...state, location: {}, forecast: {} };	
		default:
			return state;
	}
}

export default reducer;