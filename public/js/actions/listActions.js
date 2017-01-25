import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_LIST: 'GOT_LIST',
  ADD_TO_LIST: 'ADD_TO_LIST',
  REMOVE_FROM_LIST: 'REMOVE_FROM_LIST',
  CLEAR_LIST: 'CLEAR_LIST',
  SET_NEXT_PAGE: 'SET_NEXT_PAGE',
};

const gotList = (collection, list) => ({
  type: actions.GOT_LIST,
  collection,
  list,
});

const setNextPage = nextPage => ({
  type: actions.SET_NEXT_PAGE,
  nextPage,
});

export const addToList = (collection, items) => ({
  type: actions.ADD_TO_LIST,
  collection,
  items,
});

const fetchList = (collection, params, reset = true) => (dispatch) => {
  dispatch(startProgressIndicator());
  return apiBillRun(params)
  .then((success) => {
    try {
      if (reset) {
        dispatch(gotList(collection, success.data[0].data.details));
        dispatch(setNextPage(success.data[0].data.next_page));
      } else {
        dispatch(addToList(collection, success.data[0].data.details));
      }
      return dispatch(apiBillRunSuccessHandler(success));
    } catch (e) {
      console.log('fetchList error: ', e);
      throw new Error('Error retreiving list');
    }
  })
  .catch(error => dispatch(apiBillRunErrorHandler(error, 'Network error - please refresh and try again')));
};

export const clearList = collection => ({
  type: actions.CLEAR_LIST,
  collection,
});

export const deleteFromList = (collection, index) => ({
  type: actions.REMOVE_FROM_LIST,
  collection,
  index,
});

export const getList = (collection, params, reset) => dispatch =>
  dispatch(fetchList(collection, params, reset));
