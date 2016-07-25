import { GOT_CUSTOMER,
         GOT_CUSTOMERS,
         UPDATE_CUSTOMER_FIELD,
         SAVE_SUBSCRIBER,
         GOT_SUBSCRIBER_SETTINGS,
         GET_NEW_SUBSCRIBER,
         CLEAR_CUSTOMER } from '../actions/customerActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS([]);

export default function (state = defaultState, action) {
  let { field_id, value } = action;
  switch (action.type) {
  case GOT_CUSTOMERS:
    return Immutable.fromJS(action.customers).toList();

  case GOT_CUSTOMER:
    let { customer } = action;
    return Immutable.fromJS({customer});

  case UPDATE_CUSTOMER_FIELD:
    return state.setIn(['customer', field_id], value);

  case SAVE_SUBSCRIBER:
    const sub = state.toJS();
    const { newCustomer } = action;
    console.log('saving customer, newCustomer? ', newCustomer, sub);
    return state;

  case CLEAR_CUSTOMER:
    return defaultState;

  default:
    return state;
  }
}
