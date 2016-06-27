export const GOT_USAGES = 'GOT_USAGES';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotUsages(usages) {
  return {
    type: GOT_USAGES,
    usages
  };
}

function fetchUsages() {
  let fetchUrl = `/api/find?collection=lines`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotUsages(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}

export function getUsages() {
  return dispatch => {
    return dispatch(fetchUsages());
  }
}
