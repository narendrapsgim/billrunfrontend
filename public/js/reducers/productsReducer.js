import { GOT_PRODUCTS } from '../actions/productsActions';
import Immutable from 'immutable';

export default function (state = Immutable.List(), action) {
  switch(action.type) {
  case GOT_PRODUCTS:
    return Immutable.fromJS(action.products).toList();
  default:
    return state;
  }
}
