import Immutable from 'immutable';
import {
  SERVICE_PRODUCTS_SET,
  SERVICE_PRODUCTS_INIT,
  SERVICE_PRODUCTS_CLEAR,
  SERVICE_PRODUCTS_REMOVE } from '../../actions/serviceProductsActions';

let DefaultState = Immutable.List();

const serviceProductsReducer = (state = DefaultState, action) => {

  switch (action.type) {
    case SERVICE_PRODUCTS_INIT:
      return Immutable.List(action.products.map( (prod) => prod.key));

    case SERVICE_PRODUCTS_SET:
      return state.push( ...action.products.map( (prod) => prod.key));

    case SERVICE_PRODUCTS_REMOVE:
      //for new price -> remove forever
      if(!action.existing){
        var itemIndex = state.findIndex((key) => key === action.productKey);
        state = state.delete(itemIndex);
      }
      return state;

    case SERVICE_PRODUCTS_CLEAR:
      return DefaultState;

    default:
      return state;
  }

}

export default serviceProductsReducer;
