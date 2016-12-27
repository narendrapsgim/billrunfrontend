export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SYSTEM_REQUIREMENTS_LOADING_COMPLETE = 'SYSTEM_REQUIREMENTS_LOADING_COMPLETE';

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
