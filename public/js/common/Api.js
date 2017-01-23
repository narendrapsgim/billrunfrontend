import { hideProgressBar } from '../actions/progressbarActions';
import { showDanger } from '../actions/alertsActions';

// Helper function to simulate API response with delay
export function delay(sec = 2, success = true, mock = { success: true }) {
  return new Promise((resolve, reject) => {
    const callback = success
      ? () => { resolve(mock); }
      : () => { reject(mock); };
    setTimeout(callback, sec * 1000);
  });
}

// Helper function to bulind query options
function buildQueryOptions(options = null) {
  // default options
  const requestOptions = {
    credentials: 'include',
  };
  // overide / add option
  if (options) {
    Object.assign(requestOptions, options);
  }
  return requestOptions;
}

// Helper function to build API url
function buildApiString(params = {}) {
  switch (params.api) {
    case 'billapi':
    case undefined:
      return `/billapi/${params.entity}/${params.action}`;
    case 'save':
    case 'savePPIncludes':
      return `/admin/${params.api}`;
    case 'paymentgateways':
      return `/${params.api}/${params.action}`;
    default:
      return `/api/${params.api}`;
  }
}

// Helper function to bulind query params string
function buildQueryString(params = null) {
  let queryParams = '';
  if (params && Array.isArray(params) && params.length > 0) {
    queryParams = params.reduce((previousValue, currentValue, currentIndex) => {
      const key = Object.keys(currentValue)[0];
      const prev = (currentIndex === 0) ? previousValue : `${previousValue}&`;
      return `${prev}${encodeURIComponent(key)}=${encodeURIComponent(currentValue[key])}`;
    }, '?');
  }
  // Set server debug flag if it enabled in config file
  if (globalSetting.serverApiDebug === true) {
    queryParams += (queryParams.length > 0) ? '&' : '?';
    queryParams += globalSetting.serverApiDebugQueryString;
  }
  return queryParams;
}

// Handel API errors
export function apiBillRunErrorHandler(error, defaultMessage = 'Error, please try again...') {
  return (dispatch) => {
    console.log('Api Error Handler, error: ', error);
    dispatch(hideProgressBar());
    let errorMessage;
    if (typeof error.message === 'string') {
      errorMessage = error.message;
    } else {
      try {
        errorMessage = error.error[0].error.data.message;
      } catch (e1) {
        try {
          errorMessage = error.error[0].error.message;
        } catch (e2) {
          try {
            errorMessage = error.error.error[0].error.message;
          } catch (e3) {
            errorMessage = defaultMessage;
          }
        }
      }
    }
    dispatch(showDanger(errorMessage));
  };
}

// Send Http request
function sendHttpRequest(query) {
  // Create Api URL
  const url = globalSetting.serverUrl + buildApiString(query) + buildQueryString(query.params);
  const requestOptions = buildQueryOptions(query.options);
  const response = (query.name) ? { name: query.name } : {};
  return fetch(url, requestOptions)
    .then(res => res.json())
    .then((body) => { // Check login
      if (body && body.code === 17574) {
        location.reload();
        return false;
      }
      return body;
    })
    .then((data) => { // Check status OK
      if (!data || !data.status) {
        throw data;
      }
      return Object.assign(response, { data, status: 1 });
    })
    .catch(error => Object.assign(response, { error, status: 0 }));
}

// Send to API
export function apiBillRun(requests, params = {}) {
  // Default api params
  const apiParams = Object.assign({ requiredAllSuccess: true }, params);
  const apiRequests = Array.isArray(requests) ? requests : [requests];
  // Create Prommisses array from queries
  const promiseRequests = apiRequests.map(request => sendHttpRequest(request));
  // Send All prommisses
  return Promise.all(promiseRequests)
    .then((responses) => {
      // all requests was success
      const allSuccess = responses.every(responce => responce.status);
      if (allSuccess) {
        const data = responses.map((responce) => { delete responce.status; return responce; });
        return Promise.resolve(Object.assign({}, { data }));
      }
      // all requests was faild
      const allFaild = responses.every(responce => !responce.status);
      if (allFaild) {
        const error = responses.map((responce) => { delete responce.status; return responce; });
        return Promise.reject(Object.assign({}, { error }));
      }
      // mixed, some faild, some success
      const data = responses.filter(responce => responce.status === 1).map((responce) => { delete responce.status; return responce; });
      const error = responses.filter(responce => responce.status === 0).map((responce) => { delete responce.status; return responce; });
      const mix = Object.assign({}, { error }, { data });
      return apiParams.requiredAllSuccess ? Promise.reject(mix) : Promise.resolve(mix);
    })
    .catch(error => Promise.reject(Object.assign({}, { error })));
}
