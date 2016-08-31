import { combineReducers } from 'redux';
import list from './listReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';


export default combineReducers({
  list,
  dashboard,
  user
});
