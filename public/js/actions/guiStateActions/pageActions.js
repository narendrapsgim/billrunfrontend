export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';

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
