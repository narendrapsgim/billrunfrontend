import { apiBillRun } from '../common/Api';
import { fetchUserByIdQuery } from '../common/ApiQueries';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { saveEntity, getEntity, actions } from './entityActions';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const LOGIN_ERROR = 'LOGIN_ERROR';


export function getUser(id) {
  return getEntity('users', fetchUserByIdQuery(id));
}

export function saveUser(user, action) {
  return saveEntity('users', user, action);
}

export function updateUserField(path, value) {
  return {
    type: actions.UPDATE_ENTITY_FIELD,
    collection: 'users',
    path,
    value,
  };
}

export function deleteUserField(path) {
  return {
    type: actions.DELETE_ENTITY_FIELD,
    collection: 'users',
    path,
  };
}

export function clearUser() {
  return {
    type: actions.CLEAR_ENTITY,
    collection: 'users',
  };
}

function loginSuccess(data){
  return {
    type: LOGIN,
    data
  };
}

function logoutSuccess(){
  return {
    type: LOGOUT
  };
}

function loginError(data){
  return {
    type: LOGIN_ERROR,
    data
  };
}

export function userCheckLogin(){
  const query = { api: "auth" };
  return dispatch => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(loginSuccess(success.data[0].data.details));
        dispatch(finishProgressIndicator());
      },
      error => {
        dispatch(logoutSuccess());
        dispatch(finishProgressIndicator());
      },
    );
  }
}

export function userDoLogin(username, password){
  const query = {
    api: "auth",
    params: [ { username }, { password } ]
  };
  return dispatch => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(loginSuccess(success.data[0].data.details));
        dispatch(finishProgressIndicator());
      },
      error => {
        dispatch(loginError(error.error[0].error.details));
        dispatch(finishProgressIndicator());
      }
    );
  }
}

export function userDoLogout(){
  const query = {
    api: "auth",
    params: [ { action: 'logout' } ]
  };
  return dispatch => {
    dispatch(startProgressIndicator());
    return apiBillRun(query).then(
      success => {
        dispatch(logoutSuccess())
        dispatch(finishProgressIndicator());
      },
      error => {
        dispatch(finishProgressIndicator());
        console.log("userDoLogout error : ", error);
      }
    );
  }
}
