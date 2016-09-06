import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

export const actions = {
  GOT_LIST: 'GOT_LIST',
  CLEAR_LIST: 'CLEAR_LIST'
};

const defaultParams = {
  api: "find",
  size: 10,
  page: 0,
  query: {}
};

export function clearList(collection) {
  return {
    type: actions.CLEAR_LIST,
    collection
  };
}

function gotList(collection, list) {
  return {
    type: actions.GOT_LIST,
    collection,
    list
  };
}

function fetchList(collection, params) {
  return (dispatch) => {
    apiBillRun(params).then(
      success => {
        dispatch(gotList(collection, success.data[0].data.details));
      },
      failure => {
      }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  };
}

export function getList(collection, params = defaultParams) {
  return (dispatch) => {
    return dispatch(fetchList(collection, params));
  };
}
