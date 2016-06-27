import { GOT_CUSTOMER,
         UPDATE_SUBSCRIBER_FIELD,
         SAVE_SUBSCRIBER } from '../actions/customerActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  let { field_id, value } = action;
  switch (action.type) {
  case GOT_CUSTOMER:
    return Immutable.fromJS(action.customer);
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
