import { UPDATE_SETTING,
         GOT_SETTINGS } from '../actions/settingsActions';
import Immutable from 'immutable';

export default function (state = Immutable.Map(), action) {
  let { name, value, settings } = action;
  switch(action.type) {
  case UPDATE_SETTING:
    return state.setIn(name, value);
  case GOT_SETTINGS:
    return Immutable.fromJS(settings);
  default:
    return state;    
  }
}
