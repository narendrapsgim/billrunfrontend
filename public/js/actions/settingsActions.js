export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true,
  baseUrl: globalSetting.serverUrl
});

function gotSettings(settings) {
  return {
    type: GOT_SETTINGS,
    settings
  };
}

function fetchSettings() {
  const dummy_settings = {
    datetime: {
      date_format: "",
      time_format: "",
      time_zone: "Asia/Jerusalem"
    },
    collection: {
      invoice_overdue: "Within a week",
      invoice_overdue_email: "Test",
    }
  };
  
  let fetchUrl = `/api/find?collection=settings`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotSettings(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      /* TODO: REMOVE */
      dispatch(gotSettings(dummy_settings));
      dispatch(hideProgressBar());
    });
  };
}

export function getSettings() {
  return dispatch => {
    return dispatch(fetchSettings());
  };
}

export function updateSetting(name, value) {
  return {
    type: UPDATE_SETTING,
    name,
    value
  };
}
