import { combineReducers } from 'redux';
import alertsReducer from './alerts';
import assetsReducer from './assets';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    assets: assetsReducer
});

export default rootReducer;