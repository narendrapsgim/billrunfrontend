import { combineReducers } from 'redux';
import list from './listReducer';
import inputProcessor from './inputProcessorReducer';
import settings from './settingsReducer';

export default combineReducers({
  list,
  inputProcessor,
  settings
});
