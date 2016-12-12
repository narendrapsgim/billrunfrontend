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
  /* if (collection === "balances") {
   *   const resp = [
   *     { "_id" : {"$id": "5844819c3c18ecb240a274c5"}, "sid" : 2, "from" : "2016-09-30T21:00:00Z", "to" : "2016-10-31T22:00:00Z", "current_plan" : "Test Plan TO BE DYNAMIC", "aid" : 1, "balance" : { "cost" : 5770, "totals" : { "call" : { "usagev" : 625, "cost" : 1210, "count" : 9 }, "sms" : { "usagev" : 218, "cost" : 880, "count" : 5 }, "data" : { "usagev" : 369, "cost" : 3680, "count" : 7 } } } },
   *     { "_id" : {"$id": "5844819c3c18ecb240a274c6"}, "sid" : 2, "from" : "2016-09-30T21:00:00Z", "to" : "2016-10-31T22:00:00Z", "current_plan" : "A different plan", "aid" : 1, "balance" : { "cost" : 5770, "totals" : { "papers" : { "usagev" : 553, "cost" : 1210, "count" : 9 }, "cakes" : { "usagev" : 222, "cost" : 880, "count" : 5 }, "fish" : { "usagev" : 333, "cost" : 3680, "count" : 7 } } } }
   *   ];
   *   return (dispatch) => dispatch(gotList(collection, resp));
   * }*/
  return (dispatch) => {
    return dispatch(fetchList(collection, params));
  };
}

function fetchPaymentGateways() {
  const query = {
    pre: "paymentgateways",
    api: "list"
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
