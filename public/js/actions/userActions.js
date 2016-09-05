export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_ERROR = 'LOGIN_ERROR';

import { apiBillRun } from '../common/Api';

export function userCheckLogin(){
  const query = { api: "auth" };
  return dispatch => {
    apiBillRun(query).then(
      success => { dispatch({type: LOGIN, data: success.data[0].data.details}) },
      error => { dispatch({type: LOGOUT}) },
    );
  }
}

export function userDoLogin(username, password){
  const query = {
    api: "auth",
    params: [ { username }, { password } ]
  };
  return dispatch => {
    apiBillRun(query).then(
      success => { dispatch({type: LOGIN, data: success.data[0].data.details}) },
      error => { dispatch({type: LOGIN_ERROR, data: error[0]}) }
    );
  }
}

export function userDoLogout(){
  const query = {
    api: "auth",
    params: [ { action: 'logout' } ]
  };
  return dispatch => {
    apiBillRun(query).then(
      success => { dispatch({type: LOGOUT}) },
      error => { console.log("userDoLogout error : ", error); }
    );
  }
}
