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
  let requests = request.map( (query) => sendHttpRequest(query));
  //Send All prommisses
  var promise = new Promise((resolve, reject) => {
    Promise.all(requests).then(
      success   => {
        //Set true if all requests was success, alse false
        let status = success.every( responce => responce.status);
        resolve( Object.assign({}, {data: success}, {status: status}) );
      },
      error     => { reject( Object.assign({}, {error: error}, {status: 0}) ); }
    ).catch(
      message   => { reject( Object.assign({}, {error: message}, {status: 0}) ); }
    );
  });
  return promise;
}

//send Http request
function sendHttpRequest(query) {
  //Create Api URL
  let api = (query.api == "save") ? "/admin/" : "/api/";
  let url = globalSetting.serverUrl + api + query.api + buildQueryString(query.params);
  let requestOptions = buildQueryOptions(query.options);
  let response = (query.name) ? { name: query.name } : {};
  let promise = new Promise((resolve, reject) => {
    fetch(url, requestOptions).then(
      success => {
        success.json().then(
          body => {
            if (!body.status) throw body;
            resolve(Object.assign(response, { data: body, status:1}));
          }
        ).catch(
          error => { resolve(Object.assign(response, { error: error, status:0 })); }
        );
      }
    ).catch(
      error => { resolve(Object.assign(response, { error: error, status:0 })); }
    );
  });

  return promise;
}

//help function to bulind query options
function buildQueryOptions(options = null){
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
function buildQueryString(params = null){
  let queryParams = '';
  if(params && Array.isArray(params) && params.length > 0){
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
