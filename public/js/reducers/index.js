import { combineReducers } from 'redux';
import list from './listReducer';
import customer from './customerReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import entity from './entityReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';
import alerts from './alertsReducer';

export default combineReducers({
  list,
  customer,
  entity,
  inputProcessor,
  settings,
  dashboard,
  user,
  alerts
});
