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
  let fetchUrl = `/api/find?collection=plans&size=${query.size}&page=${query.page}`;
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

export function getPlans(query = {page: 1, size: 10}) {
  return dispatch => {
    return dispatch(fetchPlans(query));
  };
}
