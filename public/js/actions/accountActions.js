export const GOT_ACCOUNT = 'GOT_ACCOUNT';
export const UPDATE_ACCOUNT_FIELD = 'UPDATE_ACCOUNT_FIELD';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

const axiosInstance = axios.create({
  withCredentials: true,
  baseUrl: globalSetting.serverUrl
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

function fetchAccount(aid) {
  const fetchUrl = `http://billrun/api/subscribers?method=query&query={"aid":${aid}, "type":"account"}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        const account = _.first(resp.data.details);
        dispatch(gotAccount(account));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };  
}

export function getAccount(aid) {
  return dispatch => {
    return dispatch(fetchAccount(aid));
  };
}
