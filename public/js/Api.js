import { showStatusMessage } from './actions';
import { hideProgressBar } from './actions/progressbarActions';

export function apiBillRunErrorHandler(error, data) {
  return (dispatch, getState) => {
    console.log("Api Error", error, data);
    dispatch(hideProgressBar());
    dispatch(showStatusMessage('API Error', 'error'));
  };
}

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
      success   => resolve( Object.assign(response, {data: success}) ),
      error     => reject( Object.assign(response, {error: error}) )
    ).catch(
      message   => reject(Object.assign(response, {error: message}))
    );
  });
  return promise;
}

//send Http request
export function sendHttpRequest(query) {
  //Create Api URL
  let url = globalSetting.serverUrl + "/api/" + query.request.api + buildQueryStringParams(query.request.params);

  let response = (query.name) ? { name: query.name , data: {} } : { data: {} };
  let requestOptions = { credentials: 'include' };
  let promise = new Promise((resolve, reject) => {
    fetch(url, requestOptions).then(
      success => {
      if(success.ok) {
        success.json().then(
          body => {
            if(body.status) {
              resolve(Object.assign(response, { data: body.details }));
            } else {
              reject(Object.assign(response, { data: body }));
            }
          },
          error => { reject(Object.assign(response, { data: error })); }
        ).catch(
          message => { reject(Object.assign(response, { data: message })); }
        );
      } else {
        reject(Object.assign(response, { data: response }));
      }
    },
    error => { reject(Object.assign(response, { data: error })); });
  });

  return promise;
}

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

//help function to bulind query params string
function buildQueryStringParams(params){
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
