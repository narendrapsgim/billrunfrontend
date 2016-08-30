import Immutable from 'immutable';
import { actions } from '../actions/listActions';

const defaultState = Immutable.Map();

export default function (state = defaultState, action) {
  const { collection, list } = action;
  switch (action.type) {
    case actions.GOT_LIST:
      return state.set(collection, Immutable.fromJS(list).toList());

    default:
      return state;
  }
}
