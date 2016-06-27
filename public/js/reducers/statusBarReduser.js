import * as actions from '../actions';
import { SHOW_PROGRESS_BAR, HIDE_PROGRESS_BAR } from '../actions/progressbarActions';

export default function (state = {}, action) {
  switch (action.type) {

    case SHOW_PROGRESS_BAR:
      return Object.assign({}, state, {loading:true});

    case HIDE_PROGRESS_BAR:
      return Object.assign({}, state, {loading:false});

    case actions.SHOW_STATUS_MESSAGE:
      return Object.assign({}, state, {message: action.message, messageType: action.messageType});

    case actions.HIDE_STATUS_MESSAGE:
      return Object.assign({}, state, {message: null, messageType: null});

    default:
      return state;
  }
}
