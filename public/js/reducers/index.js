import { combineReducers } from 'redux'
import users from './userReducer'
import pages from './pagesReducer'
import login from './loginReducer'


export default combineReducers({
  users,
  pages,
  login
});
