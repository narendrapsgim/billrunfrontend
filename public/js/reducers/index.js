import { combineReducers } from 'redux'
import users from './userReducer'
import pages from './pages'


export default combineReducers({
  users,
  pages
});
