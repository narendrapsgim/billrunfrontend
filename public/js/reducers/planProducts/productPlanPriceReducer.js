import Immutable from 'immutable';
import {
  PLAN_PRODUCTS_SET,
  PLAN_PRODUCTS_INIT,
  PLAN_PRODUCTS_CLEAR,
  PLAN_PRODUCTS_REMOVE } from '../../actions/planProductsActions';
const DefaultState = Immutable.List();

const productPlanPriceReducer = (state = DefaultState, action) => {

  switch(action.type) {

    case PLAN_PRODUCTS_INIT:
      return Immutable.List(action.products.map( (prod) => prod.key));

    case PLAN_PRODUCTS_SET:
      return state.push( ...action.products.map( (prod) => prod.key));

    case PLAN_PRODUCTS_REMOVE:
      //for new price -> remove forever
      if(!action.existing){
        var itemIndex = state.findIndex((key) => key === action.productKey);
        state = state.delete(itemIndex);
      }
      return state;

    case PLAN_PRODUCTS_CLEAR:
      return DefaultState;

    default:
      return state;
  }
};

export default productPlanPriceReducer;
