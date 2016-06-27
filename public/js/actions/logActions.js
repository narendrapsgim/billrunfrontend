export const GOT_LOG = 'GOT_LOG';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotLog(log) {
  return {
    type: GOT_LOG,
    log
  };
}

function fetchLog() {
  let fetchUrl = `/api/find?collection=log`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotLog(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}

export function getLog() {
  return dispatch => {
    return dispatch(fetchLog());
  }
}
