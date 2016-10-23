import {
  GOT_SERVICE,
  CLEAR_SERVICE,
  UPDATE_SERVICE,
  ADD_GROUP_SERVICE,
  REMOVE_GROUP_SERVICE } from '../actions/serviceActions';
import Immutable from 'immutable';

const DefaultState = Immutable.Map({
  description: '',
  name: '',
  price: ''
});

const serviceReducer = (state = DefaultState, action) => {

  switch (action.type) {
    case CLEAR_SERVICE:
      return DefaultState;

    case GOT_SERVICE:
      return Immutable.fromJS(action.item);

    case UPDATE_SERVICE:
      return state.setIn(action.path, action.value);

    case ADD_GROUP_SERVICE:
      const group = Immutable.Map({
        [action.usage] : action.value,
        'account_shared': action.shared
      });
      return state.setIn(['include', 'groups', action.groupName], group);

    case REMOVE_GROUP_SERVICE:
      return state.deleteIn(['include', 'groups', action.groupName]);

    default:
      return state;
  }

}

export default serviceReducer;
