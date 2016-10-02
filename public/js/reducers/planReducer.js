import {
  REMOVE_INCLUDE,
  ADD_INCLUDE,
  CHNAGE_INCLUDE,
  UPDATE_PLAN_FIELD_VALUE,
  UPDATE_PLAN_CYCLE,
  UPDATE_PLAN_PRICE,
  ADD_TARIFF,
  REMOVE_TARIFF,
  GOT_PLAN,
  CLEAR_PLAN } from '../actions/planActions';
import moment from 'moment';
import Immutable from 'immutable';

const PLAN_CYCLE_UNLIMITED = globalSetting.planCycleUnlimitedValue;
const defaultState = Immutable.Map();
const defaultTariff = Immutable.Map({
  price: '',
  from: '',
  to: PLAN_CYCLE_UNLIMITED
});


export default function (state = defaultState, action) {

  switch (action.type) {
    
    case REMOVE_INCLUDE:
      return state.deleteIn(['include', 'groups', action.groupName, action.usaget]);

    case ADD_INCLUDE:
      return state.setIn(['include', 'groups', action.groupName, action.usaget], action.value);

    case CHNAGE_INCLUDE:
      return state.updateIn(['include', 'groups', action.groupName, action.usaget], value => action.value);

    case UPDATE_PLAN_FIELD_VALUE:
      return state.updateIn(action.path, value => action.value);

    case UPDATE_PLAN_CYCLE:
      return state.updateIn(['price'], list => _reaclculateCycles(list, action.index, action.value));

    case UPDATE_PLAN_PRICE:
      return state.updateIn(['price', action.index], item => item.set('price', action.value));

    case ADD_TARIFF:
      // if trail add to head
      if(action.trial){
        let trial = defaultTariff.set('trial', true).set('to', '').set('from', 0);
        return state.updateIn(['price'], list => {
          if(typeof list === 'undefined'){
            list = Immutable.List();
          }
          return list.unshift(trial)
        });
      }
      //Clear current last item Unlimited value if it unlimited
      var size = state.get('price', Immutable.List()).size;
      if(size > 0 && state.getIn(['price', size-1, 'to']) === PLAN_CYCLE_UNLIMITED){
        state = state.updateIn(['price', size-1], item => item.set('to',''));
      }
      var lastTo = size > 0 ? parseInt(state.getIn(['price', size-1, 'to']) || 0) : 0;
      var newTariff = defaultTariff.set('from', lastTo);
      return state.update('price', list => {
        if(typeof list === 'undefined'){
          list = Immutable.List();
        }
        return list.push(newTariff)
      });

    case REMOVE_TARIFF:
      //Set new last item value to unlimited
      // var size = state.get('price').size;
      // if(size > 1){
      //   state = state.updateIn(['price', (size - 2)], item => item.set('to', PLAN_CYCLE_UNLIMITED));
      // }
      state = state.update('price', list => list.delete(action.index));
      //recaluculate cycle
      return state.updateIn(['price'], list => _reaclculateCycles(list, action.index));

    case GOT_PLAN:
      return Immutable.fromJS(action.plan);

    case CLEAR_PLAN:
      return defaultState;

    default:
      return state;
  }
}

function _reaclculateCycles(prices, index, value){
  return prices.reduce( (newList, price, i, iter) => {
    if(i == index){
      //set new To
      if(typeof value === 'undefined'){ // first item was removed
        price = price.set('to', parseInt(price.get('to', 0) || 0) - parseInt(price.get('from', 0) || 0));
      }
      else if(value === PLAN_CYCLE_UNLIMITED){ // last value set to unlimited
        price = price.set('to', value);
      } else { // simple case, update to new value
        price = price.set('to', parseInt(price.get('from') || 0) + parseInt(value));
      }
      //set new From
      if(index === 0){
         price = price.set('from', 0);
      }
      return newList.push(price);
    } else if(i > index){
      var from = price.get('from', 0);
      var to = price.get('to', '');
      //set new From
      var prevTo = parseInt(newList.last().get('to', 0) || 0);
      price = price.set('from', prevTo);
      //set new To
      if(to === ''){ //TO not set
        price = price.set('to', price.get('from'));
      } else if(to === PLAN_CYCLE_UNLIMITED ){ //TO is unlimited
        // do nothing
      } else { // normal case, update with shifting
        var diff = parseInt(to || 0) - parseInt(from || 0);
        price = price.set('to', prevTo + diff);
      }
      return newList.push(price);
    }
    return newList.push(price);
  }, Immutable.List());
}