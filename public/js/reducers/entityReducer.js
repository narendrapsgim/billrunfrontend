import Immutable from 'immutable';
import { GOT_ENTITY, UPDATE_ENTITY_FIELD, CLEAR_ENTITY } from '../actions/entityActions';

const defaultState = Immutable.fromJS({});

export default function (state = defaultState, action) {
  const { collection, field_id, value, type, entity } = action;
  switch (type) {
    case GOT_ENTITY:
      return state.set(collection, Immutable.fromJS(entity));

    case UPDATE_ENTITY_FIELD:
      return state.setIn([collection, field_id], value);

    case CLEAR_ENTITY:
      if (collection) return state.set(collection, Immutable.Map())
      return defaultState;
      
    default:
      return state;
  }
}
