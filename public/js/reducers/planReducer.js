import {
  REMOVE_GROUP,
  ADD_GROUP,
  UPDATE_PLAN_FIELD_VALUE,
  UPDATE_PLAN_CYCLE,
  ADD_TARIFF,
  REMOVE_TARIFF,
  GOT_PLAN,
  CLEAR_PLAN,
  ADD_USAGET_INCLUDE } from '../actions/planActions';
import {
  ADD_BALANCE_NOTIFICATIONS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION_FIELD,
  REMOVE_BALANCE_NOTIFICATIONS,
  BLOCK_PRODUCT,
  REMOVE_BLOCK_PRODUCT,
  ADD_BALANCE_THRESHOLD,
  CHANGE_BALANCE_THRESHOLD
} from '../actions/prepaidPlanActions';
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

    case REMOVE_GROUP:
      return state.deleteIn(['include', 'groups', action.groupName]);

    case ADD_GROUP:
      const group = Immutable.Map({
        [action.usage] : action.value,
        'account_shared': action.shared
      });
      return state.setIn(['include', 'groups', action.groupName], group);

    case UPDATE_PLAN_FIELD_VALUE:
      return state.updateIn(action.path, '', value => action.value);

    case UPDATE_PLAN_CYCLE:
      return state.updateIn(['price'], list => _reaclculateCycles(list, action.index, action.value));

    case ADD_TARIFF: {
      // If trail add to head
      if (action.trial) {
        const trial = defaultTariff.set('trial', true).set('from', 0);
        if (!state.get('price', Immutable.List()).isEmpty()) {
          return state.update('price', Immutable.List(), list => list.unshift(trial.set('to', '')));
        }
        return state.update('price', Immutable.List(), list => list.unshift(trial));
      } else if (state.get('price', Immutable.List()).isEmpty()) {
        return state.update('price', Immutable.List(), list => list.push(defaultTariff));
      }
      return state.update('price', Immutable.List(), list =>
        list
          .update(list.size - 1, Immutable.Map(), item => item.set('to', ''))
          .push(defaultTariff)
      );
    }

    case REMOVE_TARIFF:
      if (action.index < 1) {
        return state.update('price', Immutable.List(), list => list.delete(action.index));
      }
      return state.update('price', Immutable.List(), list =>
        list
          .update(action.index - 1, item => item.set('to', PLAN_CYCLE_UNLIMITED))
          .delete(action.index)
      );

    case GOT_PLAN:
      return Immutable.fromJS(action.plan);

    case CLEAR_PLAN:
      return defaultState;

    case ADD_BALANCE_NOTIFICATIONS:
      let new_notifications = Immutable.List([Immutable.Map({value: 0, type: '', msg: ''})]);
      return state.setIn(['notifications_threshold', action.balance], new_notifications);

    case ADD_NOTIFICATION:
      let new_notification = Immutable.Map({value: 0, type: '', msg: ''});
      return state.updateIn(["notifications_threshold", action.threshold_id],
			    Immutable.List(),
			    list => list.push(new_notification));

    case REMOVE_NOTIFICATION:
      return state.updateIn(["notifications_threshold", action.threshold_id],
			    Immutable.List(),
			    list => list.remove(action.index));

    case UPDATE_NOTIFICATION_FIELD:
      return state.setIn(["notifications_threshold",
			  action.threshold_id,
			  action.index,
			  action.field], action.value);

    case REMOVE_BALANCE_NOTIFICATIONS:
      return state.setIn(["notifications_threshold", action.balance_id], Immutable.List());

    case BLOCK_PRODUCT:
      return state.update("disallowed_rates", Immutable.List(), list => list.push(action.rate));

    case REMOVE_BLOCK_PRODUCT:
      return state.update('disallowed_rates',
			  Immutable.List(),
			  list => list.filterNot(p => p === action.rate));

    case ADD_BALANCE_THRESHOLD:
      return state.setIn(['pp_threshold', action.balance_id], 0);

    case CHANGE_BALANCE_THRESHOLD:
      return state.setIn(['pp_threshold', action.balance_id], action.value);

    case ADD_USAGET_INCLUDE:
      let { pp_includes_name, pp_includes_external_id } = action;
      const newInclude = Immutable.fromJS({
        usagev: 0,
        period: {
          unit: '',
          duration: 0
        },
        pp_includes_name,
        pp_includes_external_id});
      return state.setIn(['include', action.usaget], newInclude);

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
