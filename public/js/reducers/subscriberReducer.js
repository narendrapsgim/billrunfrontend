import { GOT_CUSTOMER,
         GOT_CUSTOMERS,
         UPDATE_SUBSCRIBER_FIELD,
         SAVE_SUBSCRIBER,
         GOT_SUBSCRIBER_SETTINGS } from '../actions/customerActions';
import Immutable from 'immutable';

const defaultState = {
  customer: [],
  settings: {
    account: {
      fields: []
    },
    subscriber: {
      fields: []
    }
  }
};

export default function (state = Immutable.fromJS(defaultState), action) {
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
    let sub = state.toJS();
    console.log('saving customer', sub);
    return state;
    
  default:
    return state;
  }
}
