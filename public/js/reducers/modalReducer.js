import Immutable from 'immutable';

import { SHOW_MODAL, HIDE_MODAL } from '../actions/modalActions';

const defaultState = Immutable.fromJS({
  show: false,
  title: "",
  message: ""
});

export default function (state = defaultState, action) {
  const { message, type, title } = action;
  switch (type) {
    case SHOW_MODAL:
      return state.set('message', message).set('title', title).set('show', true);

    case HIDE_MODAL:
      return defaultState;

    default:
      return state;
  }
}
