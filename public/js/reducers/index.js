import { combineReducers } from 'redux';
import list from './listReducer';
import customer from './customerReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import entity from './entityReducer';
import dashboard from './dashboardReducer';
import product from './productReducer';
import user from './userReducer';
import alerts from './alertsReducer';
import progressIndicator from './progressIndicatorReducer';

export default combineReducers({
  progressIndicator,
  product,
  user,
  alerts,
  list,
  customer,
  entity,
  inputProcessor,
  settings,
  dashboard,
});
