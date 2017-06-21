import Immutable from 'immutable';
import {
  SET_PAGE_TITLE,
  SYSTEM_REQUIREMENTS_LOADING_COMPLETE,
  SHOW_ON_BOARDING,
  TOGGLE_BOARDING,
} from '../../actions/guiStateActions/pageActions';
import { LOGIN } from '../../actions/userActions';


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

    case LOGIN: {
      if (action.data && action.data.last_login === null) {
        return state.set('onBoarding', true);
      }
      return state;
    }
    case TOGGLE_BOARDING: {
      return state.set('onBoarding', !state.get('onBoarding', true));
    }

    default:
      return state;
  }
};

export default pageReducer;
