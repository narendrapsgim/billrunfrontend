import { combineReducers } from 'redux';
import list from './listReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';
import progressIndicator from './progressIndicatorReducer';


export default combineReducers({
  progressIndicator,
  user,
  dashboard,
  list,
});
