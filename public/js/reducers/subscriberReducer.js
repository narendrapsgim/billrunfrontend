import { GOT_CUSTOMER,
         GOT_CUSTOMERS,
         UPDATE_SUBSCRIBER_FIELD,
         SAVE_SUBSCRIBER,
         GOT_SUBSCRIBER_SETTINGS,
         GET_NEW_CUSTOMER,
         CLEAR_CUSTOMER } from '../actions/customerActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  customer: [],
  settings: {
    account: {
      fields: []
    },
    subscriber: {
      fields: []
    }
  }
});

export default function (state = defaultState, action) {
  let { field_id, value } = action;
  switch (action.type) {
  case GOT_CUSTOMERS:
    return Immutable.fromJS(action.customers).toList();

  case GOT_SUBSCRIBER_SETTINGS:
    return state.set('settings', Immutable.fromJS(action.settings));

  case GOT_CUSTOMER:
    let { customer, settings } = action;
    return Immutable.fromJS({customer, settings});

  case UPDATE_SUBSCRIBER_FIELD:
    return state.set(field_id, value);

  case SAVE_SUBSCRIBER:
    const sub = state.toJS();
    const { newCustomer } = action;
    console.log('saving customer, newCustomer? ', newCustomer, sub);
    return state;
    
  case GET_NEW_CUSTOMER:
  case CLEAR_CUSTOMER:
    return defaultState;

  default:
    return state;
  }
}
