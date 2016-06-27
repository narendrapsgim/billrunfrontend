import { combineReducers } from 'redux'
import statusBar from './statusBarReduser'
import users from './userReducer'
import pages from './pagesReducer'
import login from './loginReducer'
import plan  from './planReducer'
import subscriber from './subscriberReducer'
import usages from './usagesReducer'

export default combineReducers({
  statusBar,
  users,
  pages,
  login,
  plan,
  subscriber,
  usages
});
