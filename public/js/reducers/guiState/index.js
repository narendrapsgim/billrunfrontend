import { combineReducers } from 'redux';
import deleteConfirmShow from './deleteConfirmShowReducer';
import page from './pageReducer';


export default combineReducers({
  deleteConfirmShow,
  page,
});
