import Immutable from 'immutable';
import {
  GOT_SERVICE,
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

    case ADD_GROUP_SERVICE: {
      const group = Immutable.Map({
        [action.usage]: action.value,
        account_shared: action.shared,
        rates: Immutable.List(action.products),
      });
      return state.setIn(['include', 'groups', action.groupName], group);
    }

    case REMOVE_GROUP_SERVICE:
      return state.deleteIn(['include', 'groups', action.groupName]);

    default:
      return state;
  }
};

export default serviceReducer;
