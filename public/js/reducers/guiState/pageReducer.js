import Immutable from 'immutable';
import {
  SET_PAGE_TITLE,
  SYSTEM_REQUIREMENTS_LOADING_COMPLETE,
  SHOW_ON_BOARDING,
  TOGGLE_BOARDING,
} from '../../actions/guiStateActions/pageActions';

const defaultState = Immutable.Map({
  title: ' ',
  systemRequirementsLoad: false,
  onBoarding: false,
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

    case SHOW_ON_BOARDING: {
      return state.set('onBoarding', action.show);
    }

    case TOGGLE_BOARDING: {
      return state.set('onBoarding', !state.get('onBoarding', true));
    }

    default:
      return state;
  }
};

export default pageReducer;
