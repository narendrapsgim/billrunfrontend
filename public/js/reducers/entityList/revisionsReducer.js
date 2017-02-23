import Immutable from 'immutable';
import { actions } from '../../actions/entityListActions';

const defaultState = Immutable.Map();

const revisionsReducer = (state = defaultState, action) => {
  switch (action.type) {

    case actions.CLEAR_REVISIONS: {
      const { collection = null, key = null } = action;
      if (collection && key) {
        return state.deleteIn([action.collection, action.key]);
      }
      if (collection && !key) {
        return state.delete(action.collection);
      }
      return state;
    }

    case actions.SET_REVISIONS: {
      const { collection = null, key = null, revisions = [] } = action;
      const items = Immutable.fromJS(revisions).toList();
      if (collection && key) {
        return state.setIn([collection, key], items);
      }
      return state;
    }

    default:
      return state;
  }
};

export default revisionsReducer;
