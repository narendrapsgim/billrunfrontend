import * as actions from '../actions';

export default function loaderReduser(state = {}, action) {
  console.log();
  switch (action.type) {
    case actions.SHOW_LOADER:
      return Object.assign({}, state, {loading:true});
    case actions.HIDE_LOADER:
      return Object.assign({}, state, {loading:false});
    case actions.SHOW_MESSAGE:
      return Object.assign({}, state, {message: action.message, messageType: action.messageType});
    case actions.HIDE_MESSAGE:
      return Object.assign({}, state, {message: null, messageType: null});
    default:
    return state;
  }
}
