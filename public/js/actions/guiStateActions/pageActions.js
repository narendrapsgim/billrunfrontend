export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SYSTEM_REQUIREMENTS_LOADING_COMPLETE = 'SYSTEM_REQUIREMENTS_LOADING_COMPLETE';
export const SHOW_ON_BOARDING = 'SHOW_ON_BOARDING';
export const TOGGLE_BOARDING = 'TOGGLE_BOARDING';

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
  type: SHOW_ON_BOARDING,
  show,
});

export const toggleOnBoarding = (show = false) => ({
  type: TOGGLE_BOARDING,
});
