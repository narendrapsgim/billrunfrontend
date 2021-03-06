import { combineReducers } from 'redux';
import progressIndicator from './progressIndicatorReducer';
import alerts from './alertsReducer';
import list from './listReducer';
import entityList from './entityList';
import entity from './entityReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import dashboard from './dashboardReducer';
import product from './productReducer';
import user from './userReducer';
import plan from './planReducer';
import exportGenerator from './exportGeneratorReducer';
import service from './serviceReducer';
import collections from './collections';
import guiState from './guiState';
import pager from './pager';

export default combineReducers({
  progressIndicator,
  product,
  user,
  alerts,
  entityList,
  list,
  entity,
  inputProcessor,
  settings,
  dashboard,
  plan,
  exportGenerator,
  service,
  collections,
  guiState,
  pager,
});
