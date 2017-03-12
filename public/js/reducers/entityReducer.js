import Immutable from 'immutable';
import { actions } from '../actions/entityActions';

const defaultState = Immutable.Map();

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

    case actions.CLONE_RESET_ENTITY: {
      const keysToDeleteOnClone = ['_id', 'from', 'to', 'originalValue'];
      if (typeof action.uniquefields === 'string') {
        keysToDeleteOnClone.push(action.uniquefields);
      } else if (Array.isArray(action.uniquefields)) {
        keysToDeleteOnClone.push(...action.uniquefields);
      }
      // deleteAll() function still not avalible in v3.8.1 only from 4.0
      // return state.deleteAll(keysToDeleteOnClone);
      return state.withMutations((itemWithMutations) => {
        keysToDeleteOnClone.forEach((keyToDelete) => {
          itemWithMutations.delete(keyToDelete);
        });
      });
    }

    case actions.CLEAR_ENTITY:
      if (collection) {
        return state.set(collection, Immutable.Map());
      }
      return defaultState;

    default:
      return state;
  }
}
