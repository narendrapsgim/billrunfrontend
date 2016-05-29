import aja from 'aja';

export const UPDATE_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const GOT_ITEM = 'GOT_COLLECTION_ITEMS';
export const SAVE_FORM = 'SAVE_FORM';
export const SET_INITIAL_ITEM = 'SET_INITIAL_ITEM';
export const NEW_FIELD = 'NEW_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const CHECK_LOGIN = 'checkLogin';
export const SAVE_ITEM_ERROR = 'SAVE_ITEM_ERROR';

import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function setInitialItem(page_name) {
  return {
    type: SET_INITIAL_ITEM,
    page_name
  };
}

export function updateFieldValue(path, field_value, page_name) {
  return {
    type: UPDATE_FIELD_VALUE,
    path,
    field_value,
    page_name
  };
}

export function newField(path, field_type, page_name) {
  return {
    type: NEW_FIELD,
    path,
    field_type,
    page_name
  };
}

export function removeField(path, page_name) {
  return {
    type: REMOVE_FIELD,
    path,
    page_name
  };
}

function gotItem(item, collection, page_name) {
  return {
    type: GOT_ITEM,
    item,
    page_name,
    collection
  };
}

function saveItemError(item, collection, page_name) {
  return {
    type: SAVE_ITEM_ERROR,
    errorMessage : 'Error, please try again.',
    item,
    page_name,
    collection
  };
}

function fetchItem(item_id, collection, page_name) {
  return dispatch => {
    let queryString = `/api/find?collection=${collection}&query={"_id":{"$in" : ["${item_id}"]}}`;
    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '&' + globalSetting.serverApiDebugQueryString;
    }
    aja()
      .url(globalSetting.serverUrl + queryString)
      .on('success', response => {
        let item = _.values(response.details).shift();
        dispatch(gotItem(item, collection, page_name));
      })
      .go();
  };
}

export function getCollectionEntity(entity_id, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItem(entity_id, collection, page_name));
  };
}

export function saveCollectionEntity(item, collection, page_name, action) {
  let saveUrl = '/admin/save';
  let entity = Object.assign({}, item);
  let id = entity._id['$id'];

  delete entity['_id'];
  delete entity['from'];
  delete entity['name'];

  var formData = new FormData();
  formData.append("id", id);
  formData.append("coll", collection);
  formData.append("type", action);
  formData.append("data", JSON.stringify(entity));

  return dispatch => {
    let request = axiosInstance.post(saveUrl, formData).then(
      response => {
        if(response.data){
          dispatch(fetchItem(id, collection, page_name));
        } else {
          dispatch(saveItemError(item, collection, page_name));
        }
      }
    );
  }
}

export function userCheckLogin(){
  let checkLoginUrl = '/api/auth';
  let request = axiosInstance.get(checkLoginUrl);
  return {
    type: CHECK_LOGIN,
    data: request
  }
}

export function userDoLogin({username, password}){
  let loginUrl = `/api/auth?username=${username}&password=${password}`;
  let request = axiosInstance.get(loginUrl);
  return {
    type: LOGIN,
    data: request
  }
}

export function userDoLogout(){
  let logoutUrl = '/api/auth?action=logout';
  return dispatch => {
    let request = axiosInstance.get(logoutUrl).then(
      response => {
        dispatch({type: LOGOUT});
      }
    );
  }
}
