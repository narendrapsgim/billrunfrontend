export const GOT_ACCOUNT = 'GOT_ACCOUNT';
export const UPDATE_ACCOUNT_FIELD = 'UPDATE_ACCOUNT_FIELD';
export const GET_NEW_ACCOUNT = 'GET_NEW_ACCOUNT';

import axios from 'axios';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function updateAccountField(field_id, value) {
  return {
    type: UPDATE_ACCOUNT_FIELD,
    field_id,
    value
  };
}

function gotAccount(account) {
  return {
    type: GOT_ACCOUNT,
    account
  };
}

function getNewAccount() {
  return {
    type: GET_NEW_ACCOUNT
  };
}

function fetchAccount(aid) {
  const fetchUrl = `/api/subscribers?method=query&query={"aid":${aid}, "type":"account"}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        const account = _.first(resp.data.details);
        dispatch(gotAccount(account));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };  
}

export function getAccount(aid) {
  if (!aid) {
    return dispatch => {
      return dispatch(getNewAccount());
    };
  }
  return dispatch => {
    return dispatch(fetchAccount(aid));
  };
}
