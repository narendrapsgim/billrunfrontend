import Immutable from 'immutable';
import { ADD_GROUP, REMOVE_GROUP } from '../actions/includeGroupsActions';

const DefaultState = Immutable.Map();

const includeGroupsReducer = (state = DefaultState, action) => {
  switch (action.type) {

    case ADD_GROUP: {
      const group = Immutable.Map({
        [action.usage]: action.value,
        account_shared: action.shared,
        rates: Immutable.List(action.products),
      });
      return state.setIn(['include', 'groups', action.groupName], group);
    }

    case REMOVE_GROUP:
      return state.deleteIn(['include', 'groups', action.groupName]);

    default:
      return state;
  }
};

export default includeGroupsReducer;
