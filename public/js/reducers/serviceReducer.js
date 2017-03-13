import Immutable from 'immutable';
import includeGroupsReducer from './includeGroupsReducer';
import { ADD_GROUP, REMOVE_GROUP } from '../actions/includeGroupsActions';
import {
  GOT_SERVICE,
  CLONE_RESET_SERVICE,
  CLEAR_SERVICE,
  UPDATE_SERVICE,
  ADD_GROUP_SERVICE,
  REMOVE_GROUP_SERVICE } from '../actions/serviceActions';

const DefaultState = Immutable.fromJS({
  description: '',
  name: '',
  price: [{
    from: 0,
    to: globalSetting.serviceCycleUnlimitedValue,
    price: '',
  }],
});

const serviceReducer = (state = DefaultState, action) => {
  switch (action.type) {
    case CLEAR_SERVICE:
      return DefaultState;

    case GOT_SERVICE:
      return Immutable.fromJS(action.item);

    case UPDATE_SERVICE:
      return state.setIn(action.path, action.value);

    case CLONE_RESET_SERVICE: {
      const keysToDeleteOnClone = ['_id', 'from', 'to', 'originalValue', ...action.uniquefields];
      return state.withMutations((itemWithMutations) => {
        keysToDeleteOnClone.forEach((keyToDelete) => {
          itemWithMutations.delete(keyToDelete);
        });
      });
    }

    case ADD_GROUP_SERVICE: {
      const includeGroupsAction = Object.assign({}, action, { type: ADD_GROUP });
      return includeGroupsReducer(state, includeGroupsAction);
    }

    case REMOVE_GROUP_SERVICE: {
      const includeGroupsAction = Object.assign({}, action, { type: REMOVE_GROUP });
      return includeGroupsReducer(state, includeGroupsAction);
    }

    default:
      return state;
  }
};

export default serviceReducer;
