import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

export const actions = {
  GOT_LIST: 'GOT_LIST'
};

const defaultParams = {
  api: "find",
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
      api: params.api,
      params: [
        { collection: params.collection || collection },
        { size: params.size },
        { page: params.page },
        { query: _.isString(params.query) ? params.query : JSON.stringify(params.query) }
      ]
    };
    if (params.additional) {
      params.additional.map(add => {
        query.params.push(add);
      });
    }

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
