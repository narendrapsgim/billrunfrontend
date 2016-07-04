import { combineReducers } from 'redux'
import statusBar from './statusBarReduser'
import users from './userReducer'
import pages from './pagesReducer'
import login from './loginReducer'
import plan  from './planReducer'
import plans  from './plansReducer'
import subscriber from './subscriberReducer'
import usages from './usagesReducer'
import log from './logReducer'
import product from './productReducer';
import products from './productsReducer'
import settings from './settingsReducer';
import invoices from './invoicesReducer';
import inputProcessor from './inputProcessorReducer';

export default combineReducers({
  statusBar,
  users,
  pages,
  login,
  plan,
  plans,
  subscriber,
  usages,
  log,
  products,
  product,
  settings,
  invoices,
  inputProcessor
});
