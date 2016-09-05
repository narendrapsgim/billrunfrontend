import Immutable from 'immutable';
import { GOT_CUSTOMER, UPDATE_CUSTOMER_FIELD, CLEAR_CUSTOMER } from '../actions/customerActions';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  const { field_id, value, type, customer } = action;
  switch (type) {
    case GOT_CUSTOMER:
      return Immutable.fromJS(customer);

    case UPDATE_CUSTOMER_FIELD:
      return state.set(field_id, value);

    case CLEAR_CUSTOMER:
      return defaultState;
      
    default:
      return state;
  }
}
