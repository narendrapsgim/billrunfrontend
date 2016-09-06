import Immutable from 'immutable';
import { actions } from '../actions/listActions';

const defaultState = Immutable.Map();

export default function (state = defaultState, action) {
  const { collection, list, type } = action;
  switch (type) {
    case actions.GOT_LIST:
      return state.set(collection, Immutable.fromJS(list).toList());

    case actions.CLEAR_LIST:
      if (collection) return state.set(collection, Immutable.List());
      return defaultState;
    
    default:
      return state;
  }
}
