import { combineReducers } from 'redux'
import statusBar from './statusBarReduser'
import users from './userReducer'
import pages from './pagesReducer'
import login from './loginReducer'


export default combineReducers({
  statusBar,
  users,
  pages,
  login
});
