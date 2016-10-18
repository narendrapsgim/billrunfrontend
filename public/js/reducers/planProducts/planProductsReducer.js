import Immutable from 'immutable';
import {
  PLAN_PRODUCTS_CLEAR,
  PLAN_PRODUCTS_INIT,
  PLAN_PRODUCTS_SET,
  PLAN_PRODUCTS_REMOVE,
  PLAN_PRODUCTS_UNDO_REMOVE,
  PLAN_PRODUCTS_RESTORE,
  PLAN_PRODUCTS_RATE_REMOVE,
  PLAN_PRODUCTS_RATE_UPDATE,
  PLAN_PRODUCTS_RATE_ADD,
  PLAN_PRODUCTS_RATE_INIT } from '../../actions/planProductsActions';
import {
  PLAN_INCLUDE_GROUP_PRODUCTS_ADD,
  PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE,
  PLAN_INCLUDE_GROUP_PRODUCTS_SET } from '../../actions/planGroupsActions';
  import { REMOVE_GROUP } from '../../actions/planActions';
  import { REMOVE_GROUP_SERVICE } from '../../actions/serviceActions';

const DefaultState = Immutable.Map();
const DefaultRate = Immutable.Record({
  from: '',
  to: '',
  interval: '',
  price: ''
});

const planProductsReducer = (state = DefaultState, action) => {

  const existingKeys = state.keySeq();

  switch(action.type) {

    case PLAN_PRODUCTS_RATE_INIT:
      let baseRatePath = action.path.map( (val, i) => (i === 2) ? 'BASE' : val );
      let baseRate = state.getIn([action.productKey, ...baseRatePath]);
      return state.setIn([action.productKey, ...action.path], baseRate );

    case PLAN_PRODUCTS_RATE_ADD:
      let itemRates = state.getIn([action.productKey, ...action.path], Immutable.List());
      let newRate = (itemRates && itemRates.size) ? itemRates.last() : new DefaultRate() ;
      state = state.updateIn([action.productKey, ...action.path], list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(newRate);
      });
      return state;

    case PLAN_PRODUCTS_RATE_UPDATE:
      return state.setIn([action.productKey, ...action.path], action.value);

    case PLAN_PRODUCTS_RATE_REMOVE:
      return state.deleteIn([action.productKey, ...action.path, action.idx ]);

    case PLAN_PRODUCTS_REMOVE:
      //for existing set flag for UNDO option
      if(action.existing){
        state = state.update(action.productKey, (item) =>
          item.withMutations((mutableItem) =>
            mutableItem
              .setIn(['uiflags', 'removed'], true)
              .setIn(['uiflags', 'oldValue'], mutableItem.getIn(action.path))
          )
        );
      }
      state = state.deleteIn([action.productKey, ...action.path]);
      return state;

    case PLAN_PRODUCTS_UNDO_REMOVE:
      if(state.getIn([action.productKey, 'uiflags', 'existing']) === true){
        state = state.update(action.productKey, (item) =>
          item.withMutations((mutableItem) =>
            mutableItem
              .setIn(action.path, mutableItem.getIn(['uiflags','oldValue']))
              .setIn(['uiflags','removed'], false)
          )
        );
      }
      return state;

    case PLAN_PRODUCTS_RESTORE:
      state = state.update(action.productKey, (item) =>
        item.withMutations((mutableItem) =>
          mutableItem
            .setIn(action.path, mutableItem.getIn(['uiflags','originValue']))
            .setIn(['uiflags','removed'], false)
        )
      );
      return state;

    case PLAN_PRODUCTS_INIT:
      state = state.withMutations( mapWithMutations => {
        action.products.forEach( prod => {
          var unit = Object.keys(prod.rates)[0];
          prod.uiflags = {
            existing: true,
            originValue: [...prod.rates[unit][action.planName].rate]
          };
          mapWithMutations.set(prod.key, Immutable.fromJS(prod));
        });
      });
      return state;

    case PLAN_PRODUCTS_SET:
    case PLAN_INCLUDE_GROUP_PRODUCTS_SET:
      state = state.withMutations(mapWithMutations => {
        action.products.forEach( prod => {
          if(!existingKeys.includes(prod.key)){
            mapWithMutations.set(prod.key, Immutable.fromJS(prod));
          }
        });
      });
      return state;

    case PLAN_INCLUDE_GROUP_PRODUCTS_ADD:
      //Add product if not exist
      state = state.withMutations(mapWithMutations => {
        action.products.forEach( prod => {
          if(!existingKeys.includes(prod.key)){
            mapWithMutations.set(prod.key, Immutable.fromJS(prod));
          }
        });
      });

      action.products.forEach( (prod) => {
        state = state.updateIn([ prod.key, 'rates', action.usage, 'groups'], (list) => {
          if(typeof list === 'undefined'){
            list = Immutable.List();
          }
          return list.push(action.group);
        });
      });
      return state;

    case PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE:
      action.productKeys.forEach( (key) => {
        state = state.updateIn([key, 'rates', action.usage, 'groups'], list => list.filter( group => group !== action.group));
      });
      return state;

    case REMOVE_GROUP:
    case REMOVE_GROUP_SERVICE:
      action.productKeys.forEach( (key) => {
        state = state.updateIn([key, 'rates', action.usage, 'groups'], list => list.filter( group => group !== action.groupName));
      });
      return state;

    case PLAN_PRODUCTS_CLEAR:
      return DefaultState;

    default:
      return state;
  }
};

export default planProductsReducer;
