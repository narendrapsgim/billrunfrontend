import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_ENTITY_LIST: 'GOT_ENTITY_LIST',
  CLEAR_ENTITY_LIST: 'CLEAR_ENTITY_LIST',
  SET_NEXT_PAGE: 'SET_NEXT_PAGE',
  SET_FILTER: 'SET_FILTER',
  SET_PAGE: 'SET_PAGE',
  SET_SORT: 'SET_SORT',
  SET_SIZE: 'SET_SIZE',
};

const gotList = (collection, list) => ({
  type: actions.GOT_ENTITY_LIST,
  collection,
  list,
});

const setNextPage = (collection, nextPage) => ({
  type: actions.SET_NEXT_PAGE,
  collection,
  nextPage,
});

const fetchList = (collection, params) => (dispatch) => {
  dispatch(startProgressIndicator());
  return apiBillRun(params)
    .then((success) => {
      try {
        dispatch(gotList(collection, success.data[0].data.details));
        dispatch(setNextPage(collection, success.data[0].data.next_page));
        return dispatch(apiBillRunSuccessHandler(success));
      } catch (e) {
        console.log('fetchList error: ', e);
        throw new Error('Error retreiving list');
      }
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Network error - please refresh and try again')));
};

export const setListSort = (collection, sort) => ({
  type: actions.SET_SORT,
  collection,
  sort,
});

export const setListSize = (collection, size) => ({
  type: actions.SET_SIZE,
  collection,
  size,
});

export const setListFilter = (collection, filter) => ({
  type: actions.SET_FILTER,
  collection,
  filter,
});

export const setListPage = (collection, page) => ({
  type: actions.SET_PAGE,
  collection,
  page,
});

export const clearList = collection => ({
  type: actions.CLEAR_ENTITY_LIST,
  collection,
});

export const getList = (collection, params, reset) => dispatch =>
  dispatch(fetchList(collection, params, reset));
