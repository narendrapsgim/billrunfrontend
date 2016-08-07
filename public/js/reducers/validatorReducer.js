import * as actions from '../actions/validatorActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  valid: true
});

export default function (state = defaultState, action) {
  switch(action.type) {
    case actions.INVALID_FORM:
      return action.validations;

    default:
      return state;
  }
}
