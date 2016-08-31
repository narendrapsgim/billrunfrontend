import { GOT_USAGES } from '../actions/usageActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  switch (action.type) {
  case GOT_USAGES:
    return Immutable.fromJS(action.usages).toList();
  default:
    return state;
  }
}
