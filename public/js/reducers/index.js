import { combineReducers } from 'redux'
import statusBar from './statusBarReduser'
import users from './userReducer'
import pages from './pagesReducer'
import login from './loginReducer'
import plan  from './planReducer'
import subscriber from './subscriberReducer'

export default combineReducers({
  statusBar,
  users,
  pages,
  login,
  plan,
  subscriber
});
