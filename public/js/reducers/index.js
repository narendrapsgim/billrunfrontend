import { combineReducers } from 'redux';
import list from './listReducer';
import dashboard from './dashboardReducer';


export default combineReducers({
  list,
  dashboard
});
