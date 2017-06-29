import Immutable from 'immutable';
import {
  SET_PAGE_TITLE,
  SYSTEM_REQUIREMENTS_LOADING_COMPLETE,
  ONBOARDING_SHOW,
  ONBOARDING_TOGGLE,
  ONBOARDING_SET_STEP,
  ONBOARDING_SET_STATE,
  onBoardingStates,
} from '../../actions/guiStateActions/pageActions';
import { LOGIN } from '../../actions/userActions';


const defaultState = Immutable.Map({
  title: ' ',
  systemRequirementsLoad: false,
  onBoarding: Immutable.Map({
    show: false,
    step: 0,
    state: onBoardingStates.READY,
  }),
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

    case ONBOARDING_SHOW: {
      return state.setIn(['onBoarding', 'show'], action.show);
    }

    case ONBOARDING_SET_STEP: {
      return state.setIn(['onBoarding', 'step'], action.step);
    }

    case ONBOARDING_SET_STATE: {
      return state.setIn(['onBoarding', 'state'], action.state);
    }

    case LOGIN: {
      if (action.data && action.data.last_login === null) {
        return state.setIn(['onBoarding', 'show'], true);
      }
      return state;
    }
    case ONBOARDING_TOGGLE: {
      return state.setIn(['onBoarding', 'show'], !state.getIn(['onBoarding', 'show'], true));
    }

    default:
      return state;
  }
};

export default pageReducer;
