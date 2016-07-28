import { UPDATE_PAYMENT_DETAILS_FIELD, SUBMIT_PAYMENT_DETAILS } from '../actions/paymentDetailsActions';

import Immutable from 'immutable';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  const { field, value, type } = action;
  switch (type) {
    case UPDATE_PAYMENT_DETAILS_FIELD:
      return state.set(field, value);

    case SUBMIT_PAYMENT_DETAILS:
      console.log(state);
      return state;
    
    default:
      return state;
  }
}
