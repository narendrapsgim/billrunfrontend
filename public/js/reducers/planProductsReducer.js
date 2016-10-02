import {
  PLAN_PRODUCTS_SET,
  PLAN_PRODUCTS_INIT,
  PLAN_PRODUCTS_CLEAR,
  PLAN_PRODUCTS_RESTORE,
  PLAN_PRODUCTS_REMOVE,
  PLAN_PRODUCTS_UNDO_REMOVE,
  PLAN_PRODUCTS_RATE_ADD,
  PLAN_PRODUCTS_RATE_INIT,
  PLAN_PRODUCTS_RATE_UPDATE,
  PLAN_PRODUCTS_RATE_REMOVE } from '../actions/planProductsActions';
import {
  PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE,
  PLAN_INCLUDE_GROUP_PRODUCTS_SET,
  PLAN_INCLUDE_GROUP_PRODUCTS_ADD } from '../actions/planGroupsActions';
import Immutable from 'immutable';


var DefaultRate = Immutable.Record({
  from: '',
  to: '',
  interval: '',
  price: ''
});

var DefaultState = Immutable.Map({
  productPlanPrice: Immutable.List(),
  productIncludeGroup: Immutable.Map(),
  planProducts: Immutable.Map()
});

export default function (state = DefaultState, action) {
  switch(action.type) {

    case PLAN_INCLUDE_GROUP_PRODUCTS_SET:
      state = state.updateIn(['productIncludeGroup', action.group,  action.usage], list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(...action.products.map(prod => {return {key: prod.key}}))
      });
      state = state.updateIn(['planProducts'], (map) => map.withMutations(
        mutablePlanProducts => {
          action.products.forEach( prod => {
            if(typeof state.getIn(['planProducts', prod.key]) === 'undefined'){
              mutablePlanProducts.set(prod.key, Immutable.fromJS(prod));
            }
          })
        })
      );
      return state

    case PLAN_INCLUDE_GROUP_PRODUCTS_ADD:
      state = state.updateIn(['productIncludeGroup', action.group,  action.usage], list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(...action.products.map(prod => {return {key: prod.key}}))
      });
      state = state.updateIn(['planProducts'], (map) => map.withMutations(
        mutablePlanProducts => {
          action.products.forEach( prod => {
            if(typeof state.getIn(['planProducts', prod.key]) === 'undefined'){
              mutablePlanProducts.set(prod.key, Immutable.fromJS(prod));
            }
          })
        })
      );
      action.products.forEach( (prod) => {
        state = state.updateIn(['planProducts', prod.key, 'rates', action.usage, 'groups'], (list) => {
          if(typeof list === 'undefined'){
            list = Immutable.List();
          }
          return list.push(action.group);
        });
      });
      return state

    case PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE:
      state = state.updateIn(['productIncludeGroup', action.group, action.usage], list => list.filter( (product) =>  !action.keys.includes(product.key) ));
      action.keys.forEach( (key) => {
        state = state.updateIn(['planProducts', key, 'rates', action.usage, 'groups'], (list) => list.filter( (group) => group !== action.group));
      });
      return state;

    case PLAN_PRODUCTS_SET:
      state = state.updateIn(['productPlanPrice'], (list) => list.push( ...action.products.map( (prod) => prod.key)))
      state = state.updateIn(['planProducts'], (map) => map.withMutations(
        mutablePlanProducts => {
          action.products.forEach( prod => {
            if(typeof state.getIn(['planProducts', prod.key]) === 'undefined'){
              mutablePlanProducts.set(prod.key, Immutable.fromJS(prod));
            }
          })
        })
      );
      return state;

    case PLAN_PRODUCTS_INIT:
      state = state.set('productPlanPrice', Immutable.List(action.products.map( (prod) => prod.key)));
      state = state.updateIn(['planProducts'], (map) => map.withMutations(
        mutablePlanProducts => {
          action.products.forEach( prod => {
            var unit = Object.keys(prod.rates)[0];
            prod.uiflags = {
              existing: true,
              originValue: [...prod.rates[unit][action.planName].rate]
            };
            mutablePlanProducts.set(prod.key, Immutable.fromJS(prod));
          })
        })
      );
      return state;

    case PLAN_PRODUCTS_REMOVE:
      //for existing set flag for UNDO option
      if(state.getIn(['planProducts', action.productKey, 'uiflags', 'existing']) === true){
        state = state.updateIn(['planProducts', action.productKey], (item) =>
          item.withMutations((mutableItem) =>
            mutableItem
              .setIn(['uiflags', 'removed'], true)
              .setIn(['uiflags', 'oldValue'], mutableItem.getIn(action.path))
          )
        );
      }
      //new price -> remove forever
      else {
        var itemIndex = state.get('productPlanPrice').findIndex((key) => key === action.productKey);
        state = state.deleteIn(['productPlanPrice', itemIndex]);
      }
      state = state.deleteIn(['planProducts', action.productKey, ...action.path]);
      return state;

    case PLAN_PRODUCTS_RESTORE:
      state = state.updateIn(['planProducts', action.productKey], (item) =>
        item.withMutations((mutableItem) =>
          mutableItem
            .setIn(action.path, mutableItem.getIn(['uiflags','originValue']))
            .setIn(['uiflags','removed'], false)
        )
      );
      return state;

    case PLAN_PRODUCTS_UNDO_REMOVE:
      if(state.getIn(['planProducts', action.productKey, 'uiflags', 'existing']) === true){
        state = state.updateIn(['planProducts', action.productKey], (item) =>
          item.withMutations((mutableItem) =>
            mutableItem
              .setIn(action.path, mutableItem.getIn(['uiflags','oldValue']))
              .setIn(['uiflags','removed'], false)
          )
        );
      }
      return state;

    case PLAN_PRODUCTS_RATE_UPDATE:
      return state.updateIn(['planProducts', action.productKey], (item) => item.setIn(action.path, action.value));

    case PLAN_PRODUCTS_RATE_ADD:
      let rate = state.getIn(['planProducts', action.productKey]);
      let insertItem = (rate.getIn(action.path) && rate.getIn(action.path).size > 0) ? rate.getIn(action.path).last() : new DefaultRate() ;
      state = state.updateIn(['planProducts', action.productKey], (item) => item.updateIn(action.path, list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(insertItem)
      }));
      return state;

    case PLAN_PRODUCTS_RATE_INIT:
      let baseRatePath = action.path.map( (val, i) => (i === 2) ? 'BASE' : val );
      let baseRate = state.getIn(['planProducts', action.productKey, ...baseRatePath]);
      return state.updateIn(['planProducts', action.productKey], (item) => item.setIn(action.path, baseRate) );

    case PLAN_PRODUCTS_RATE_REMOVE:
      return state.updateIn(['planProducts', action.productKey] , (item) => item.updateIn(action.path, list => list.delete(action.idx)) );

    case PLAN_PRODUCTS_CLEAR:
      return DefaultState;

    default:
      return state;
  }
}
