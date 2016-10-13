import { combineReducers } from 'redux';
import productPlanPrice from './productPlanPriceReducer';
import productIncludeGroup from './productIncludeGroupReducer';
import planProducts from './planProductsReducer';


export default combineReducers({
  productPlanPrice,
  productIncludeGroup,
  planProducts,
});
