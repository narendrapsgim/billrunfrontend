import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';
import { showDanger } from './alertsActions';

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
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(params).then(
      success => {
	dispatch(finishProgressIndicator());
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
    pre: "paymentgateways",
    api: "list"
  };

  const dummy_data = [
    { name: "PayPal_Express", image_url: "https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png", params: {user: "", password: ""}, supported: 1},
    { name: "Stripe", image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Stripe_logo,_revised_2014.png/200px-Stripe_logo,_revised_2014.png", params: {token: ""}, supported: 1}
  ];

  return (dispatch) => {
    dispatch(gotList('supported_gateways', dummy_data));
  };
  
  /*  
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
  */
}

export function getPaymentGateways() {
  return (dispatch) => {
    return dispatch(fetchPaymentGateways());
  };
}
