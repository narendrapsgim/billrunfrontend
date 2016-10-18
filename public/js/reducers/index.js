import { combineReducers } from 'redux';
import progressIndicator from './progressIndicatorReducer';
import alerts from './alertsReducer';
import list from './listReducer';
import entity from './entityReducer';
import customer from './customerReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import dashboard from './dashboardReducer';
import product from './productReducer';
import user from './userReducer';
import plan from './planReducer';
import planProducts from './planProducts';
import exportGenerator from './exportGeneratorReducer';
import services from './servicesReducer';
import collections from './collections';


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
  plan,
  planProducts,
  exportGenerator,
  services,
  collections
});
