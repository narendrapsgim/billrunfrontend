import Immutable from 'immutable';
import {
  PLAN_INCLUDE_GROUP_PRODUCTS_ADD,
  PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE,
  PLAN_INCLUDE_GROUP_PRODUCTS_SET } from '../../actions/planGroupsActions';
import { PLAN_PRODUCTS_CLEAR } from '../../actions/planProductsActions';

const DefaultState = Immutable.Map();

const productIncludeGroupReducer = (state = DefaultState, action) => {

  switch(action.type) {

    case PLAN_INCLUDE_GROUP_PRODUCTS_ADD:
    case PLAN_INCLUDE_GROUP_PRODUCTS_SET:
      state = state.updateIn([action.group,  action.usage], list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        let prodKeys = action.products.map( prod => prod.key );
        return list.push( ...prodKeys );
      });
      return state;

    case PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE:
      state = state.updateIn([action.group, action.usage], list =>
        list.filter( (productKey) =>  !action.productKeys.includes(productKey) )
      );
      return state;

    case PLAN_PRODUCTS_CLEAR:
      return DefaultState;

    default:
      return state;
  }
};

export default productIncludeGroupReducer;
