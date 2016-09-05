import { combineReducers } from 'redux';
import list from './listReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';
import alerts from './alertsReducer';
import progressIndicator from './progressIndicatorReducer';


export default combineReducers({
  progressIndicator,
  user,
  alerts,
  list,
  dashboard,
});
