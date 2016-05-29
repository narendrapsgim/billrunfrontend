import { combineReducers } from 'redux'
import users from './userReducer'
import pages from './pagesReducer'


export default combineReducers({
  users,
  pages
});
