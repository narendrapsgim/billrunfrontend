import Immutable from 'immutable';
import { SET_PAGE_TITLE, SYSTEM_REQUIREMENTS_LOADING_COMPLETE } from '../../actions/guiStateActions/pageActions';

const defaultState = Immutable.Map({
  title: ' ',
  systemRequirementsLoad: false,
});

const pageReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_PAGE_TITLE: {
      const newTitle = typeof action.title !== 'undefined' ? action.title : defaultState.get('title');
      return state.set('title', newTitle);
    }

    case SYSTEM_REQUIREMENTS_LOADING_COMPLETE: {
      return state.set('systemRequirementsLoad', true);
    }
    default:
      return state;
  }
};

export default pageReducer;
