import Immutable from 'immutable';
import { ADD_GROUP, REMOVE_GROUP } from '../actions/includeGroupsActions';

const DefaultState = Immutable.Map();

const includeGroupsReducer = (state = DefaultState, action) => {
  switch (action.type) {

    case ADD_GROUP: {
      const group = Immutable.Map({
        [action.usage]: action.value,
        unit: action.unit,
        account_shared: action.shared,
        account_pool: action.pooled,
        rates: Immutable.List(action.products),
      });
      return state
        // if groups is empty, server return it as empty array instead of empty object
        // in this case ImmutableJS will fail to set new group at key XYZ on list
        .updateIn(['include', 'groups'], Immutable.Map(), groups => (groups.isEmpty() ? Immutable.Map() : groups))
        .setIn(['include', 'groups', action.groupName], group);
    }

    case REMOVE_GROUP:
      return state.deleteIn(['include', 'groups', action.groupName]);

    default:
      return state;
  }
};

export default includeGroupsReducer;
