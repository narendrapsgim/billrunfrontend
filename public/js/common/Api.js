import { dismissProgressIndicator, finishProgressIndicator } from '../actions/progressIndicatorActions';
import { showDanger, showSuccess, showWarning } from '../actions/alertsActions';
import { getConfig } from './Util';


export const API_STATUS_SUCCESS = 1;
export const API_STATUS_ERROR = 0;
export const API_STATUS_WARNING = 2;


// Helper function to simulate API response with delay
export const delay = (sec = 2, success = true, mock = { success: true }) =>
  new Promise((resolve, reject) => {
    const callback = success
      ? () => { resolve(mock); }
      : () => { reject(mock); };
    setTimeout(callback, sec * 1000);
  });

// Helper function to remove status property from response object
const removeStatus = ({ status, ...rest }) => rest; // eslint-disable-line no-unused-vars

// Helper function to check response user login
const checkLogin = (response = {}) => {
  if (response.code === 17574) {
    location.reload();
    throw new Error('login is required');
  }
  return response;
};

// Helper function to check response status OK
const checkStatus = (response = null) => {
  if (!response || response.status === API_STATUS_ERROR) { // Check status OK
    throw response;
  }
  return response;
};

// Helper function to bulind query options
const buildQueryOptions = (options = null) => {
  // default options
  const requestOptions = {
    credentials: 'include',
  };
  // overide / add option
  if (options) {
    Object.assign(requestOptions, options);
  }
  return requestOptions;
};

// Helper function to build API url
const buildApiString = (params = {}) => {
  switch (params.api) {
    case 'billapi':
    case undefined:
      return `/billapi/${params.entity}/${params.action}`;
    case 'save':
    case 'savePPIncludes':
      return `/admin/${params.api}`;
    case 'paymentgateways':
    case 'billrun':
      return `/${params.api}/${params.action}`;
    default:
      return `/api/${params.api}`;
  }
};

// Helper function to bulind query params string
const buildQueryString = (params = null) => {
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
};

// Handel API success (ugly code to handle non standard API responses - should be improved with BillAPI)
export const apiBillRunSuccessHandler = (success, message = false) => (dispatch) => {
  dispatch(finishProgressIndicator());
  let data;
  let status = API_STATUS_SUCCESS;
  try {
    data = success.data[0].data.details;
    if (typeof data === 'undefined') {
      throw new Error();
    }
  } catch (e3) {
    try {
      data = success.data[0].data.data;
      if (typeof data === 'undefined') {
        throw new Error();
      }
    } catch (e1) {
      data = null;
    }
  }
  // Check for warning
  try {
    if (success.data[0] && success.data[0].data && success.data[0].data.status === API_STATUS_WARNING) {
      status = API_STATUS_WARNING;
      let warningMessages = [];
      try {
        warningMessages = success.data[0].data.warnings;
        if (!Array.isArray(warningMessages)) {
          throw new Error();
        }
      } catch (e1) {
        warningMessages = ['Warrning !'];
      }
      warningMessages.forEach((warningMessage) => {
        dispatch(showWarning(warningMessage, 15000));
      });
    }
  } catch (e3) { /* No success object or status */ }

  if (message && status === 1) {
    dispatch(showSuccess(message));
  }

  return ({ status, data });
};

// Handel API errors (ugly code to handle non standard API responses - should be improved with standard BillAPI)
export const apiBillRunErrorHandler = (error, defaultMessage = 'Error, please try again...') => (dispatch) => {
  console.log('Api Error Handler, error: ', error); // eslint-disable-line  no-console
  dispatch(dismissProgressIndicator());
  if (defaultMessage !== false) {
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

    dispatch(showDanger(errorMessage || defaultMessage));
  }
  return ({
    status: API_STATUS_ERROR,
    error,
  });
};


const promiseTimeout = (ms, promise, timeOutMessage = 'Request timeout') => new Promise(
  (resolve, reject) => {
    // create a timeout to reject promise if not resolved
    const promiseTimeoutTimer = setTimeout(() => {
      reject(new Error(timeOutMessage));
    }, ms);

    promise
    .then((responce) => {
      clearTimeout(promiseTimeoutTimer);
      resolve(responce);
    })
    .catch((error) => {
      clearTimeout(promiseTimeoutTimer);
      reject(error);
    });
  });

export const buildRequestUrl = query => `${getConfig('serverUrl', '')}${buildApiString(query)}${buildQueryString(query.params)}`;

// Send Http request
const sendHttpRequest = (query, apiParams = {}) => {
  // Create Api URL
  const url = buildRequestUrl(query, apiParams);
  const requestOptions = buildQueryOptions(query.options);
  const response = (query.name) ? { name: query.name } : {};
  const timeout = query.timeout || globalSetting.serverApiTimeOut;
  return promiseTimeout(timeout, fetch(url, requestOptions), apiParams.timeOutMessage)
    .then(res => res.json())
    .then(checkLogin)
    .then(checkStatus)
    .then(data => Object.assign(response, { data, status: 1 }))
    .catch(error => Object.assign(response, { error, status: 0 }));
};

// Send to API
export const apiBillRun = (requests, params = {}) => {
  // Default api params
  const apiParams = Object.assign({ requiredAllSuccess: true }, params);
  const apiRequests = Array.isArray(requests) ? requests : [requests];
  // Create Prommisses array from queries
  const promiseRequests = apiRequests.map(request => sendHttpRequest(request, apiParams));
  // Send All prommisses
  return Promise.all(promiseRequests)
    .then((responses) => {
      const data = responses.filter(responce => responce.status).map(removeStatus);
      const error = responses.filter(responce => !responce.status).map(removeStatus);
      // all requests was success
      if (data.length === responses.length) {
        return Promise.resolve({ data });
      }
      // all requests was faild
      if (error.length === responses.length) {
        return Promise.reject({ error });
      }
      // mixed, some faild, some success
      const mix = { error, data };
      return apiParams.requiredAllSuccess ? Promise.reject(mix) : Promise.resolve(mix);
    });
};
