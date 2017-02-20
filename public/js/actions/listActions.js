import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';
import { showDanger } from './alertsActions';

export const actions = {
  GOT_LIST: 'GOT_LIST',
  CLEAR_LIST: 'CLEAR_LIST',
  SET_NEXT_PAGE: 'SET_NEXT_PAGE'
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

function setNextPage(nextPage) {
  return {
    type: actions.SET_NEXT_PAGE,
    nextPage
  };
}

function fetchList(collection, params) {
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(params).then(
      success => {
	dispatch(finishProgressIndicator());
        dispatch(setNextPage(success.data[0].data.next_page));
        dispatch(gotList(collection, success.data[0].data.details));
      },
      failure => {
	dispatch(showDanger("Error retreiving list"));
        dispatch(finishProgressIndicator());
      }
    ).catch(
      error => {
        dispatch(finishProgressIndicator());
	dispatch(showDanger("Network error - please refresh and try again"));
      }
    );
  };
}

export function getList(collection, params = defaultParams) {
  return (dispatch) => {
    return dispatch(fetchList(collection, params));
  };
}

function fetchPaymentGateways() {
  const query = {
    api: "paymentgateways",
    action: "list"
  };

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
	dispatch(finishProgressIndicator());
        dispatch(gotList('supported_gateways', success.data[0].data.details));
      },
      failure => {
	dispatch(showDanger("Error retrieving payment gateways"));
        dispatch(finishProgressIndicator());
      }
    ).catch(
      error => {
        dispatch(finishProgressIndicator());
	dispatch(showDanger("Network error - please refresh and try again"));
      }
    );
  };
}

export function getPaymentGateways() {
  return (dispatch) => {
    return dispatch(fetchPaymentGateways());
  };
}
