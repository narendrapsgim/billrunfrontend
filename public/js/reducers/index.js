import { combineReducers } from 'redux';
import list from './listReducer';
import customer from './customerReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';
import entity from './entityReducer';

export default combineReducers({
  list,
  customer,
  entity,
  inputProcessor,
  settings
});
