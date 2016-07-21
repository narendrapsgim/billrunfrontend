import Immutable from 'immutable';

import { GOT_ACCOUNT,
         UPDATE_ACCOUNT_FIELD } from '../actions/accountActions';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  switch(action.type) {
    case GOT_ACCOUNT:
      return Immutable.fromJS(action.account);

    case UPDATE_ACCOUNT_FIELD:
      return state.set(action.field_id, action.value);
      
    default:
      return state;
  }
}
