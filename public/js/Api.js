import { showStatusMessage } from './actions';
import { hideProgressBar } from './actions/progressbarActions';

//help function to simulate API response with delay
export function delay(sec = 2, success = true, mock = { 'success': true }) {
  return new Promise((resolve, reject) => {
    let callback = success ? () => {
      resolve(mock);
    } : () => {
      reject(mock);
    };
    setTimeout(callback, sec * 1000);
  });
}

//Handel API errors
export function apiBillRunErrorHandler(error, data) {
  return (dispatch, getState) => {
    console.log("Api Error", error, data);
    dispatch(hideProgressBar());
    dispatch(showStatusMessage('API Error', 'error'));
  };
}

// Send to API
export function apiBillRun(request) {
  //Create Prommisses array from queries
  let requests = [];
  let response = (request.type) ? { type: request.type } : {};
  for(var i = 0; i < request.queries.length; i++) {
    requests.push(sendHttpRequest(request.queries[i]));
  }
  //Send All prommisses
  var promise = new Promise((resolve, reject) => {
    Promise.all(requests).then(
      success   => { resolve( Object.assign(response, {data: success}) ); },
      error     => { reject( Object.assign(response, {error: error}) ); }
    ).catch(
      message   => { reject( Object.assign(response, {error: message}) ); }
    );
  });
  return promise;
}

//send Http request
export function sendHttpRequest(query) {
  //Create Api URL
  let api = (query.request.api == "save") ? "/admin/" : "/api/";
  let url = globalSetting.serverUrl + api + query.request.api + buildQueryString(query.request.params);
  let requestOptions = buildQueryOptions(query.request.options);
  let response = (query.request.name) ? { name: query.request.name , data: {} } : { data: {} };
  let promise = new Promise((resolve, reject) => {
    fetch(url, requestOptions).then(
      success => {
        success.json().then(
          body => {
            if(body.status) {
              resolve(Object.assign(response, { data: (body.details || body.data) }));
            } else {
              resolve(Object.assign(response, { error: body, data: null }));
            }
          },
          error => { resolve(Object.assign(response, { error: error, data: null })); }
      ).catch(
        message => { resolve(Object.assign(response, { error: message, data: null })); }
      );
    },
    error => { resolve(Object.assign(response, { error: error, data: null })); });
  });

  return promise;
}

function buildQueryOptions(options){
  //default options
  let requestOptions = {
    credentials: 'include'
  };
  //overide / add option
  if(options){
    Object.assign(requestOptions, options);
  }
  return requestOptions;
}

//help function to bulind query params string
function buildQueryString(params){
  let queryParams = '';
  if(Array.isArray(params) && params.length > 0){
    queryParams = params.reduce((previousValue, currentValue, currentIndex) => {
      let key = Object.keys(currentValue)[0];
      let prev = (currentIndex === 0) ? previousValue : previousValue + '&';
      return prev + key + '=' + currentValue[key];
    }, '?');
  }
	//Set server debug flag if it enabled in config file
  if(globalSetting.serverApiDebug === true){
    queryParams += (queryParams.length > 0) ? '&' : '?';
    queryParams += globalSetting.serverApiDebugQueryString;
  }
  return queryParams;
}
