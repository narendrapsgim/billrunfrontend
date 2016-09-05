import { combineReducers } from 'redux';
import list from './listReducer';
import customer from './customerReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import entity from './entityReducer';
import dashboard from './dashboardReducer';
import user from './userReducer';
import alerts from './alertsReducer';
import progressIndicator from './progressIndicatorReducer';

export default combineReducers({
  progressIndicator,
  user,
  alerts,
  list,
  customer,
  entity,
  inputProcessor,
  settings,
  dashboard,
});
