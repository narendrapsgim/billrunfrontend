import { GOT_PLANS } from '../actions/plansActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  switch(action.type) {
  case GOT_PLANS:
    return Immutable.fromJS(action.plans).toList();
  default:
    return state;
  }
}
