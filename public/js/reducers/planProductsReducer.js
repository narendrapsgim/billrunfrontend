import {
  PLAN_PRODUCTS_SET,
  PLAN_PRODUCTS_CLEAR,
  PLAN_PRODUCTS_RESTORE,
  PLAN_PRODUCTS_REMOVE,
  PLAN_PRODUCTS_UNDO_REMOVE,
  PLAN_PRODUCTS_RATE_ADD,
  PLAN_PRODUCTS_RATE_INIT,
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
          action.products.forEach(prod => {
             mutableStateList.push(Immutable.fromJS(prod));
          });
      });
      return state;

    case PLAN_PRODUCTS_REMOVE:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        if(state.getIn([itemIndex, 'uiflags', 'existing']) === true){ //for existing set flag for UNDO option
          state = state.update(itemIndex, (item) =>
            item.withMutations((mutableItem) =>
              mutableItem
                .setIn(['uiflags', 'removed'], true)
                .setIn(['uiflags', 'oldValue'], mutableItem.getIn(action.path))
                .deleteIn(action.path)
            )
          );
          // state = state.update(itemIndex, (item) => item.setIn(['uiflags', 'removed'], true) );
          // state = state.update(itemIndex, (item) => item.deleteIn(action.path) );
        } else { //new price -> remove forever
          state = state.delete(itemIndex);
        }
      }
      return state;

    case PLAN_PRODUCTS_RESTORE:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        state = state.update(itemIndex, (item) =>
          item.withMutations((mutableItem) =>
            mutableItem
              .setIn(action.path, mutableItem.getIn(['uiflags','originValue']))
              .setIn(['uiflags','removed'], false)
          )
        );
      }
      return state;

    case PLAN_PRODUCTS_UNDO_REMOVE:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        var item = state.get(itemIndex);
        if(item.getIn(['uiflags','existing']) == true){
          state = state.update(itemIndex, (item) =>
            item.withMutations((mutableItem) =>
              mutableItem
                .setIn(action.path, mutableItem.getIn(['uiflags','oldValue']))
                .setIn(['uiflags','removed'], false)
            )
          );
        } else {
          state = state.update( itemIndex, (item) => item.deleteIn(['uiflags','removed']) );
        }
      }
      return state;

    case PLAN_PRODUCTS_RATE_UPDATE:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        state = state.update(itemIndex, (item) => item.setIn(action.path, action.value));
      }
      return state;

    case PLAN_PRODUCTS_RATE_ADD:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        var rate = state.get(itemIndex);
        let insertItem = (rate.get('rates').size > 0) ? rate.getIn(action.path).last() : state.get(itemIndex) ;
        state = state.update(itemIndex, (item) => item.updateIn(action.path, list => list.push(insertItem)) );
      }
      return state;

    case PLAN_PRODUCTS_RATE_INIT:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        let baseRate = state.get(itemIndex).getIn(['rates', action.usageType, 'BASE', 'rate']);
        state = state.update(itemIndex, (item) => item.setIn(['rates', action.usageType, action.planName, 'rate'], baseRate) );
      }
      return state;

    case PLAN_PRODUCTS_RATE_REMOVE:
      var itemIndex = state.findIndex((item) => item.get("key") === action.productKey);
      if(itemIndex !== -1){
        state = state.update(itemIndex, (item) => item.updateIn(action.path, list => list.delete(action.idx)) );
      }
      return state;

    case PLAN_PRODUCTS_CLEAR:
      return Immutable.List();

    default:
      return state;
  }
}
