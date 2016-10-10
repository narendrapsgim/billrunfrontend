import { combineReducers } from 'redux';
import service from './serviceReducer';
import serviceGroup from './serviceGroupReducer';
import serviceProducts from './serviceProductsReducer';


export default combineReducers({
  service,
  serviceGroup,
  serviceProducts,
});
