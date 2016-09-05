import Immutable from 'immutable';
import { SHOW_ALERT, DISMISS_ALERT, DISMISS_ALL_ALERTS } from '../actions/alertsActions';


var messages = Immutable.List();

export default function (state = messages, action) {

  switch (action.type) {

    case SHOW_ALERT:
      if( state.find( (alert) => alert.get('id') === action.alert.get('id')) ){
        return state;
      }
      return state.push(action.alert);

    case DISMISS_ALERT:
      return state.filter( (alert) => alert.get('id') !== action.id);

    case DISMISS_ALL_ALERTS:
      return messages;

    default:
      return state;
  }

}
