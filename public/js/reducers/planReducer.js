import Immutable from 'immutable';
import includeGroupsReducer from './includeGroupsReducer';
import productReduser from './productReducer';

import {
  ADD_GROUP, REMOVE_GROUP,
} from '../actions/includeGroupsActions';

import {
  PLAN_PRODUCTS_REMOVE,
  PLAN_PRODUCTS_UNDO_REMOVE,
  PLAN_PRODUCTS_RATE_UPDATE_TO,
  PLAN_PRODUCTS_RATE_UPDATE,
  PLAN_PRODUCTS_RATE_REMOVE,
  PLAN_PRODUCTS_RATE_ADD,
  PLAN_PRODUCTS_RATE_INIT,
  PLAN_UPDATE_FIELD_VALUE,
  PLAN_UPDATE_PLAN_CYCLE,
  PLAN_REMOVE_FIELD,
  PLAN_ADD_TARIFF,
  PLAN_REMOVE_TARIFF,
  PLAN_GOT,
  PLAN_CLEAR,
  REMOVE_GROUP_PLAN,
  ADD_GROUP_PLAN,
  ADD_USAGET_INCLUDE,
  PLAN_CLONE_RESET,
} from '../actions/planActions';

import {
  PRODUCT_UPDATE_FIELD_VALUE,
  PRODUCT_UPDATE_TO_VALUE,
  PRODUCT_ADD_RATE,
  PRODUCT_REMOVE_RATE,
} from '../actions/productActions';

import {
  ADD_BALANCE_NOTIFICATIONS,
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION_FIELD,
  REMOVE_BALANCE_NOTIFICATIONS,
  BLOCK_PRODUCT,
  REMOVE_BLOCK_PRODUCT,
  ADD_BALANCE_THRESHOLD,
  CHANGE_BALANCE_THRESHOLD,
  REMOVE_BALANCE_THRESHOLD,
} from '../actions/prepaidPlanActions';


const PLAN_CYCLE_UNLIMITED = globalSetting.planCycleUnlimitedValue;
const defaultState = Immutable.Map();
const defaultTariff = Immutable.Map({
  price: '',
  from: 0,
  to: PLAN_CYCLE_UNLIMITED,
});
const defaultNotification = Immutable.Map({
  value: 0,
  type: '',
  msg: '',
});


export default function (state = defaultState, action) {
  switch (action.type) {

    case PLAN_PRODUCTS_UNDO_REMOVE:
      return state.setIn([...action.path, action.price]);

    case PLAN_PRODUCTS_REMOVE:
      return state.deleteIn([...action.path, action.name]);

    case PLAN_PRODUCTS_RATE_UPDATE_TO: {
      const productAction = Object.assign(action, { type: PRODUCT_UPDATE_TO_VALUE });
      return productReduser(state, productAction);
    }

    case PLAN_PRODUCTS_RATE_UPDATE: {
      const productAction = Object.assign(action, { type: PRODUCT_UPDATE_FIELD_VALUE });
      return productReduser(state, productAction);
    }

    case PLAN_PRODUCTS_RATE_REMOVE: {
      const productAction = Object.assign(action, { type: PRODUCT_REMOVE_RATE });
      return productReduser(state, productAction);
    }

    case PLAN_PRODUCTS_RATE_ADD: {
      const productAction = Object.assign(action, { type: PRODUCT_ADD_RATE });
      return productReduser(state, productAction);
    }

    case PLAN_PRODUCTS_RATE_INIT: {
      const usaget = action.product.get('rates', Immutable.Map()).keySeq().first();
      return state.setIn(action.path, action.product.getIn(['rates', usaget, 'BASE', 'rate']));
    }

    case REMOVE_GROUP_PLAN: {
      const includeGroupsAction = Object.assign({}, action, { type: REMOVE_GROUP });
      return includeGroupsReducer(state, includeGroupsAction);
    }

    case ADD_GROUP_PLAN: {
      const includeGroupsAction = Object.assign({}, action, { type: ADD_GROUP });
      return includeGroupsReducer(state, includeGroupsAction);
    }

    case PLAN_UPDATE_FIELD_VALUE:
      return state.setIn(action.path, action.value);

    case PLAN_REMOVE_FIELD:
      return state.deleteIn(action.path);

    case PLAN_UPDATE_PLAN_CYCLE:
      return state.updateIn(['price'], list => reCalculateCycles(list, action.index, action.value));

    case PLAN_ADD_TARIFF: {
      // If trail add to head
      if (action.trial) {
        const trial = defaultTariff.set('trial', true);
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
          .push(defaultTariff.set('from', ''))
      );
    }

    case PLAN_REMOVE_TARIFF: {
      if (action.index === 0) { // removed first item
        return state.update('price', Immutable.List(), (list) => {
          if (list.size > 1) { // there is other items in list, update next item from to 0
            return list
              .update(action.index + 1, Immutable.Map(), item => item.set('from', 0))
              .delete(action.index);
          }
          return list.delete(action.index); // only on item, delete it
        });
      }
      // item removed from end and there is other items (index > 0)
      return state.update('price', Immutable.List(), list =>
        list
          .update(action.index - 1, item => item.set('to', PLAN_CYCLE_UNLIMITED))
          .delete(action.index)
      );
    }

    case PLAN_GOT:
      return Immutable.fromJS(action.plan);

    case PLAN_CLEAR:
      return defaultState;

    case PLAN_CLONE_RESET: {
      const keysToDeleteOnClone = ['_id', 'from', 'to', 'originalValue', ...action.uniquefields];
      return state.withMutations((itemWithMutations) => {
        keysToDeleteOnClone.forEach((keyToDelete) => {
          itemWithMutations.delete(keyToDelete);
        });
      });
    }

    case ADD_BALANCE_NOTIFICATIONS: {
      const newNotifications = Immutable.List([defaultNotification]);
      return state.setIn(['notifications_threshold', action.balance], newNotifications);
    }

    case ADD_NOTIFICATION:
      return state.updateIn(['notifications_threshold', action.thresholdId], Immutable.List(), list => list.push(defaultNotification));

    case REMOVE_NOTIFICATION:
      return state.updateIn(['notifications_threshold', action.thresholdId], Immutable.List(), list => list.remove(action.index));

    case UPDATE_NOTIFICATION_FIELD: {
      const path = ['notifications_threshold', action.thresholdId, action.index, action.field];
      return state.setIn(path, action.value);
    }

    case REMOVE_BALANCE_NOTIFICATIONS: {
      const path = ['notifications_threshold', action.balanceId];
      return state.setIn(path, Immutable.List());
    }

    case BLOCK_PRODUCT:
      return state.update('disallowed_rates', Immutable.List(), list => list.push(action.rate));

    case REMOVE_BLOCK_PRODUCT:
      return state.update('disallowed_rates', Immutable.List(), list => list.filterNot(p => p === action.rate));

    case ADD_BALANCE_THRESHOLD:
      return state.setIn(['pp_threshold', action.balanceId], 0);

    case CHANGE_BALANCE_THRESHOLD:
      return state.setIn(['pp_threshold', action.balanceId], action.value);

    case REMOVE_BALANCE_THRESHOLD:
      return state.deleteIn(['pp_threshold', action.balanceId]);

    case ADD_USAGET_INCLUDE: {
      const newInclude = Immutable.fromJS({
        usagev: 0,
        period: {
          unit: '',
          duration: 0,
        },
        pp_includes_name: action.ppIncludesName,
        pp_includes_external_id: action.ppIncludesExternalId,
      });
      const included = state.get('include', Immutable.List());
      return state.set('include', included.push(newInclude));
    }

    default:
      return state;
  }
}

const reCalculateCycles = (prices, index, value) => prices.reduce((newList, price, i) => {
  if (i === index) {
    // set new To
    if (typeof value === 'undefined') { // first item was removed
      price = price.set('to', parseInt(price.get('to', 0) || 0) - parseInt(price.get('from', 0) || 0));
    } else if (value === PLAN_CYCLE_UNLIMITED) { // last value set to unlimited
      price = price.set('to', value);
    } else { // simple case, update to new value
      price = price.set('to', parseInt(price.get('from') || 0) + parseInt(value));
    }
    // set new From
    if (index === 0) {
       price = price.set('from', 0);
    }
    return newList.push(price);
  } else if (i > index) {
    const from = price.get('from', 0);
    const to = price.get('to', '');
    // set new From
    const prevTo = parseInt(newList.last().get('to', 0) || 0);
    price = price.set('from', prevTo);
    // set new To
    if (to === '') { // TO not set
      price = price.set('to', price.get('from'));
    } else if (to === PLAN_CYCLE_UNLIMITED) { // TO is unlimited
      // do nothing
    } else { // normal case, update with shifting
      const diff = parseInt(to || 0) - parseInt(from || 0);
      price = price.set('to', prevTo + diff);
    }
    return newList.push(price);
  }
  return newList.push(price);
}, Immutable.List());
