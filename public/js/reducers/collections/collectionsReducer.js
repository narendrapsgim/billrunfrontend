import Immutable from 'immutable';
import { RESET_COLLECTION_EDITED, SET_COLLECTION_EDITED } from '../../actions/collectionsActions';

const defaultState = Immutable.Map({ changed: false });

const collectionsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_COLLECTION_EDITED:
      return state.set('changed', true);

    case RESET_COLLECTION_EDITED:
      return state.set('changed', false);

    default:
      return state;
  }
};

export default collectionsReducer;
