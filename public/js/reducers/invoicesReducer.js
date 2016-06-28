import { GOT_INVOICES } from '../actions/invoicesActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  let { name, value, invoices } = action;
  switch(action.type) {
  case GOT_INVOICES:
    return Immutable.fromJS(invoices);
  default:
    return state;    
  }
}
