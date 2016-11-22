import Immutable from 'immutable';
import { actions } from '../actions/entityActions';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  const { collection, field_id, value, type, entity } = action;
  switch (type) {
    case actions.GOT_ENTITY:
      return state.set(collection, Immutable.fromJS(entity));

    case actions.UPDATE_ENTITY_FIELD:
      if (Array.isArray(field_id)) {
        return state.setIn([collection, ...field_id], value);
      }
      return state.setIn([collection, field_id], value);

    case actions.CLEAR_ENTITY:
      if (collection) return state.set(collection, Immutable.Map())
      return defaultState;
      
    default:
      return state;
  }
}
