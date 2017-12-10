import { combineReducers } from 'redux';
import newCollection from './newCollectionReducer';
import collection from './collectionsReducer';


export default combineReducers({
  newCollection,
  collection,
});
