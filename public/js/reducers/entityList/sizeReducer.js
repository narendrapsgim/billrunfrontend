import Immutable from 'immutable';
import { actions } from '../../actions/entityListActions';

const defaultState = Immutable.Map();

const sizeReducer = (state = defaultState, action) => {
  switch (action.type) {

    case actions.CLEAR_LIST: {
      if (action.collection && action.collection.length > 0) {
        return state.delete(action.collection);
      }
      return state;
    }

    case actions.SET_SIZE: {
      if (action.collection && action.collection.length > 0 && !isNaN(action.size)) {
        return state.set(action.collection, parseInt(action.size));
      }
      return state;
    }

    default:
      return state;
  }
};

export default sizeReducer;
