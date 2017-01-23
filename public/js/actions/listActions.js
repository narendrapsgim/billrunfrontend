import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
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

const fetchList = (collection, params) => (dispatch) => {
  dispatch(startProgressIndicator());
  apiBillRun(params).then(
    (success) => {
      try {
        dispatch(finishProgressIndicator());
        dispatch(setNextPage(success.data[0].data.next_page));
        dispatch(gotList(collection, success.data[0].data.details));
      } catch (e) {
        throw new Error('Error retreiving list');
      }
    }
  ).catch((error) => {
    dispatch(apiBillRunErrorHandler(error, 'Network error - please refresh and try again'));
  });
};

export const clearList = collection => ({
  type: actions.CLEAR_LIST,
  collection,
});

export const addToList = (collection, item) => ({
  type: actions.ADD_TO_LIST,
  collection,
  item,
});

export const deleteFromList = (collection, index) => ({
  type: actions.ADD_TO_LIST,
  collection,
  index,
});

export const getList = (collection, params) => dispatch => dispatch(fetchList(collection, params));
