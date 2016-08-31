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

function fetchUsages(query) {
  let sort = query.sort ? `&sort={"${query.sort}":1}` : '';
  let fetchUrl = `/api/find?collection=lines&size=${query.size + 1}${sort}&page=${query.page}&query=${query.filter}`;
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

export function getUsages(query = {page: 1, size: 10, filter: ""}) {
  return dispatch => {
    return dispatch(fetchUsages(query));
  }
}
