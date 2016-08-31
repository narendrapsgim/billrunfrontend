export const GOT_PLANS = 'GOT_PLANS';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotPlans(plans) {
  return {
    type: GOT_PLANS,
    plans
  };
}

function fetchPlans(query) {
  let sort = query.sort ? `&sort={"${query.sort}":1}` : '';
  let size = query.size ? `&size=${query.size + 1}` : '';
  let page = query.page ? `&page=${query.page}` : '';
  let q = query.filter ? `&query=${query.filter}` : '';
  let fetchUrl = `/api/find?collection=plans&${size}${sort}${page}${q}`;

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotPlans(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}

export function getPlans(query = {page: 0, size: 10, filter: "", sort: ""}) {
  return dispatch => {
    return dispatch(fetchPlans(query));
  };
}
