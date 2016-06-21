import * as actions from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
  case actions.GOT_CUSTOMER:
    return action.customer;
  default:
    return state;
  }
}
