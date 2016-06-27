import { GOT_LOG } from '../actions/logActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  switch (action.type) {
  case GOT_LOG:
    return Immutable.fromJS(action.log);
  default:
    return state;
  }
}
