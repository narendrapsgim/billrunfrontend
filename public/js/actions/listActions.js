import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_LIST: 'GOT_LIST',
  CLEAR_LIST: 'CLEAR_LIST'
};

const defaultParams = {
  api: "find",
  size: 10,
  page: 0,
  sort: {},
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
  const dummy_gateways = [
    {name: "paypal", image_url: "https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png", params: ["user", "password"]},
    {name: "credit guard", image_url: "", params: ["token"]}
  ];

  return (dispatch) => {
    dispatch(startProgressIndicator());
    dispatch(finishProgressIndicator());
    if (collection === 'supported_gateways') {
      dispatch(gotList(collection, dummy_gateways));
      return;
    }    
    apiBillRun(params).then(
      success => {
        dispatch(gotList(collection, success.data[0].data.details));
      },
      failure => {
        dispatch(finishProgressIndicator());        
      }
    ).catch(
      error => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(error));
      }
    );
  };
}

export function getList(collection, params = defaultParams) {
  return (dispatch) => {
    return dispatch(fetchList(collection, params));
  };
}
