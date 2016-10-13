import { GOT_SERVICE, CLEAR_SERVICE, UPDATE_SERVICE } from '../../actions/serviceActions';
import Immutable from 'immutable';

const DefaultState = Immutable.Map({
  description: '',
  include: {},
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

    default:
      return state;
  }

}

export default serviceReducer;
