import Immutable from 'immutable';
import { actions } from '../../actions/entityListActions';

const defaultState = Immutable.Map();

const pageReducer = (state = defaultState, action) => {
  switch (action.type) {

    case actions.CLEAR_ENTITY_LIST: {
      if (action.collection && action.collection.length > 0) {
        return state.delete(action.collection);
      }
      return state;
    }

    case actions.SET_PAGE: {
      if (action.collection && action.collection.length > 0) {
        return state.set(action.collection, action.page);
      }
      return state;
    }

    default:
      return state;
  }
};

export default pageReducer;
