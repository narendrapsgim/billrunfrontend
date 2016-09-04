import { combineReducers } from 'redux';
import list from './listReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';
import alerts from './alertsReducer';


export default combineReducers({
  list,
  dashboard,
  user,
  alerts
});
