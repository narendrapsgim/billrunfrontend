import Immutable from 'immutable';
import { actions } from '../actions/entityActions';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  const { collection, path, value, type, entity } = action;
  switch (type) {

    case actions.GOT_ENTITY:
      return state.set(collection, Immutable.fromJS(entity));

    case actions.UPDATE_ENTITY_FIELD:
      if (Array.isArray(path)) {
        return state.setIn([collection, ...path], value);
      }
      return state.setIn([collection, path], value);

    case actions.DELETE_ENTITY_FIELD:
      if (Array.isArray(path)) {
        return state.deleteIn([collection, ...path]);
      }
      return state.deleteIn([collection, path]);

    case actions.CLEAR_ENTITY:
      if (collection) {
        return state.set(collection, Immutable.Map());
      }
      return defaultState;

    default:
      return state;
  }
}
