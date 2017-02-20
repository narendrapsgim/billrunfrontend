import { combineReducers } from 'redux';
import items from './itemsReducer';
import page from './pageReducer';
import sort from './sortReducer';
import filter from './filterReducer';
import nextPage from './nextPageReducer';
import size from './sizeReducer';


export default combineReducers({
  items,
  page,
  sort,
  filter,
  nextPage,
  size,
});
