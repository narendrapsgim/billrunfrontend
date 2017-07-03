export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SYSTEM_REQUIREMENTS_LOADING_COMPLETE = 'SYSTEM_REQUIREMENTS_LOADING_COMPLETE';
export const ONBOARDING_SHOW = 'SHOW_ON_BOARDING';
export const ONBOARDING_TOGGLE = 'TOGGLE_BOARDING';
export const ONBOARDING_SET_STEP = 'SET_ON_BOARDING_STEP';
export const ONBOARDING_SET_STATE = 'SET_ON_BOARDING_STATE';

export const CONFIRM_SHOW = 'CONFIRM_SHOW';
export const CONFIRM_HIDE = 'CONFIRM_HIDE';


export const onBoardingStates = {
  READY: 'READY',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
};

export function setPageTitle(title) {
  return {
    type: SET_PAGE_TITLE,
    title,
  };
}

export function emptyPageTitle() {
  return {
    type: SET_PAGE_TITLE,
  };
}

export function systemRequirementsLoadingComplete() {
  return {
    type: SYSTEM_REQUIREMENTS_LOADING_COMPLETE,
  };
}

export const showOnBoarding = (show = false) => ({
  type: ONBOARDING_SHOW,
  show,
});

export const toggleOnBoarding = () => ({
  type: ONBOARDING_TOGGLE,
});

export const setOnBoardingStep = (step = 0) => ({
  type: ONBOARDING_SET_STEP,
  step,
});

export const setOnBoardingState = (state = onBoardingStates.READY) => ({
  type: ONBOARDING_SET_STATE,
  state,
});

export const stopOnBoarding = () => ({
  type: ONBOARDING_SET_STATE,
  state: onBoardingStates.FINISHED,
});

export const showConfirm = confirm => ({
  type: CONFIRM_SHOW,
  confirm,
});

export const hideConfirm = () => ({
  type: CONFIRM_HIDE,
});
