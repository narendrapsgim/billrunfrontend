export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';

import { showStatusMessage } from '../actions';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import axios from 'axios';
import { apiBillRun, apiBillRunErrorHandler } from '../Api';

let axiosInstance = axios.create({
  withCredentials: true
});

function gotSettings(settings) {
  return {
    type: GOT_SETTINGS,
    settings
  };
}

function fetchSettings(categories) {
  const queries = categories.map(category => {
    return {
      api: "settings",
      name: category,
      params: [
        { category: category },
        { data: JSON.stringify({}) }
      ]
    };
  });

  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(queries).then(
      success => {
        dispatch(gotSettings(success.data));
      },
      failure => {
        dispatch(showStatusMessage("Network error!", "error"));
        console.log('failure', failure);
      }
    ).catch(error =>
      dispatch(apiBillRunErrorHandler(error))
    )
  };
}

export function getSettings(categories = []) {
  return (dispatch) => {
    return dispatch(fetchSettings(categories));
  };
}

export function updateSetting(category, name, value) {
  return {
    type: UPDATE_SETTING,
    category,
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
  const queries = settings.keySeq().map(category => {
    return {
      api: "settings",
      params: [
        { category: category },
        { action: "set" },
        { data: JSON.stringify(settings.get(category).toJS()) }
      ]
    };
  }).toJS();

  return (dispatch) => {
    apiBillRun(queries).then(
      success => {
        console.log('success!');
      },
      failure => {
        console.log(failure);
        console.log('failed!');
      }
    ).catch(error =>
      dispatch(apiBillRunErrorHandler(error))
    );
  }; 
}

export function saveSettings(settings) {
  return dispatch => {
    return dispatch(saveSettingsToDB(settings));
  };  
}
