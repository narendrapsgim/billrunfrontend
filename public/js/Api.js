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
export function apiBillRun(requests, requiredAllSuccess = true) {
  if(!Array.isArray(requests)){
    requests = [requests];
  }
  //Create Prommisses array from queries
  let promiseRequests = requests.map( (request) => sendHttpRequest(request));
  //Send All prommisses
  var promise = new Promise((resolve, reject) => {
    Promise.all(promiseRequests).then(
      success => {
        //all requests was success
        let allSuccess = success.every( responce => responce.status);
        if(allSuccess){
         return resolve( Object.assign({}, {data: success}) );
        }
        //all requests was faild
        let allFaild = success.every( responce => !responce.status);
        if(allSuccess){
         return reject( Object.assign({}, {error: success}) );
        }
        //mixed, some faild, some success
        let data = success.filter( responce => responce.status);
        let error = success.filter( responce => !responce.status);
        let mix = Object.assign({}, {error}, {data});
        return requiredAllSuccess ? reject( mix ) : resolve( mix );
      },
      failure => reject( Object.assign({}, {error: failure}) )
    ).catch(
      error => reject( Object.assign({}, {error}) )
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
