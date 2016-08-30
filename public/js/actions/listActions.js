import { apiBillRun } from '../common/Api';

export const actions = {
  GOT_LIST: 'GOT_LIST'
};

const defaultQuery = {
  size: 10,
  page: 0,
  query: {}
};

function gotList(collection, list) {
  return {
    type: actions.GOT_LIST,
    collection,
    list
  };
}

function fetchList(collection, params) {
  return (dispatch) => {
    const query = {
      api: "find",
      params: [
        { collection: collection },
        { size: params.size },
        { page: params.page },
        { query: JSON.stringify(params.query) }
      ]
    };

    apiBillRun(query).then(
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
