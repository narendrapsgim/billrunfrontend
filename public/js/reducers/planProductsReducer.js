import {
  PLAN_PRODUCTS_SET,
  PLAN_PRODUCTS_CLEAR,
  PLAN_PRODUCTS_REMOVE,
  PLAN_PRODUCTS_UNDO_REMOVE,
  PLAN_PRODUCTS_RATE_ADD,
  PLAN_PRODUCTS_RATE_UPDATE,
  PLAN_PRODUCTS_RATE_REMOVE } from '../actions/planProductsActions';
import Immutable from 'immutable';
import {convert} from '../actions/productActions'


var DefaultRate = Immutable.Record({
  from: undefined,
  to: undefined,
  interval: undefined,
  price: undefined
});

export default function (state = Immutable.List(), action) {
  switch(action.type) {
    case PLAN_PRODUCTS_SET:
      state = state.withMutations( mutableStateList => {
          action.products.forEach(request => {
            _.values(request.data).forEach(prod => {
               mutableStateList.push(Immutable.fromJS(convert(prod, action.planName)));
            })
          });
      });
      return state;

    case PLAN_PRODUCTS_REMOVE:
      state = state.update(
        state.findIndex(function(item) {
          return item.get("key") === action.productKey;
        }), function(item) {
          return item.set("removed", true);
        }
      );
      return state;
      //return state.filter( (item) => item.get('key') !== action.productKey);

    case PLAN_PRODUCTS_UNDO_REMOVE:
      state = state.update(
        state.findIndex(function(item) {
          return item.get("key") === action.productKey;
        }), function(item) {
          return item.delete("removed");
        }
      );
      return state;

    case PLAN_PRODUCTS_RATE_UPDATE:
      state = state.update(
        state.findIndex(function(item) {
          return item.get("key") === action.productKey;
        }), function(item) {
          return item.setIn(['rates', action.fieldIdx, action.fieldName], action.fieldValue);
        }
      );
      return state;

    case PLAN_PRODUCTS_RATE_ADD:
      let newRate = new DefaultRate();
      state = state.update(
        state.findIndex(function(item) {
          return item.get("key") === action.productKey;
        }), function(item) {
          if(item.get('rates').size > 0){
            let lastwRate = item.get('rates').last();
            return item.update('rates', list => list.push(lastwRate));
          }
          return item.update('rates', list => list.push(newRate));
        }
      );
      return state;

    case PLAN_PRODUCTS_RATE_REMOVE:
      state = state.update(
        state.findIndex(function(item) {
          return item.get("key") === action.productKey;
        }), function(item) {
          return item.update('rates', list => list.delete(action.fieldIdx));
        }
      );
      return state;

    case PLAN_PRODUCTS_CLEAR:
      return Immutable.List();

    default:
      return state;
  }
}
