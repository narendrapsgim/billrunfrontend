import Immutable from 'immutable';
import { SET_PAGE_TITLE } from '../../actions/guiStateActions/pageActions';

const defaultState = Immutable.Map({
  title: ' ',
});

const pageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_PAGE_TITLE: {
      const newTitle = typeof action.title !== 'undefined' ? action.title : defaultState.get('title');
      return state.set('title', newTitle);
    }
    default:
      return state;
  }
};

export default pageReducer;
