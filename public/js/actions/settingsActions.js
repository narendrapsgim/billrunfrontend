export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import axios from 'axios';

let axiosInstance = axios.create({
  withCredentials: true
});

function gotSettings(category, settings) {
  return {
    type: GOT_SETTINGS,
    category,
    settings
  };
}

function fetchSettings(category) {
  let fetchUrl = `${globalSetting.serverUrl}/api/settings?category=${category}&data={}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        //dispatch(gotSettings(resp.data.details));
        dispatch(gotSettings(category, resp.data.details));
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

function savedSettings() {
  return {
    type: 'saved_settings'
  };
}

function saveSettingsToDB(settings) {
  let setUrl = `/api/settings?category=settingscat&action=set&data=${JSON.stringify(settings.toJS())}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };  
  
}

export function saveSettings(settings) {
  return dispatch => {
    return dispatch(saveSettingsToDB(settings));
  };  
}
