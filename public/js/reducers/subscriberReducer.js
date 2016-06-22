import * as actions from '../actions';
import Immutable from 'immutable';

export default function (state = {}, action) {
  switch (action.type) {
  case actions.GOT_CUSTOMER:
    return Immutable.fromJS(action.customer);
  case actions.UPDATE_SUBSCRIBER_FIELD:
    
  default:
    return state;
  }
}
