export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true
});

function gotSettings(settings) {
  return {
    type: GOT_SETTINGS,
    settings
  };
}

function fetchSettings(category) {
  let fetchUrl = `${globalSetting.serverUrl}/api/settings?category=${category}&data={}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotSettings(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      /* TODO */
      dispatch(hideProgressBar());
    });
  };
}

export function getSettings(category="") {
  return (dispatch) => {
    return dispatch(fetchSettings(category));
  };
}

export function updateSetting(name, value) {
  return {
    type: UPDATE_SETTING,
    name,
    value
  };
}
