import * as actions from '../actions';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action) {
  let { field_id, value } = action;
  switch (action.type) {
  case actions.GOT_CUSTOMER:
    return Immutable.fromJS(action.customer);
  case actions.UPDATE_SUBSCRIBER_FIELD:
    return state.setIn(field_id, value);
  default:
    return state;
  }
}
