export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';
export const ADD_PAYMENT_GATEWAY = 'ADD_PAYMENT_GATEWAY';
export const REMOVE_PAYMENT_GATEWAY = 'REMOVE_PAYMENT_GATEWAY';
export const UPDATE_PAYMENT_GATEWAY = 'UPDATE_PAYMENT_GATEWAY';

import { showStatusMessage } from '../actions/commonActions';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { showSuccess, showDanger } from './alertsActions';

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
    if (!Array.isArray(categories)) return dispatch(fetchSettings([categories]));
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

function saveSettingsToDB(category, settings = Immutable.Map(), action = 'set', data) {
  if (!data) {
    data = settings.get(category).toJS();
  }
  if (category === "pricing") {
    data.vat = data.vat / 100;
  }
  const query = {
    api: "settings",
    params: [
      { category: category },
      { action: action },
      { data: JSON.stringify(data) }
    ]
  };

  return (dispatch) => {
    apiBillRun(query).then(
      success => {
        dispatch(showSuccess("Settings saved successfuly!"));
      },
      failure => {
        console.log('failed!', failure);
        dispatch(showDanger("Error saving settings"));
      }
    ).catch(error =>
      dispatch(apiBillRunErrorHandler(error))
    );
  }; 
}

export function saveSettings(category, settings) {
  return dispatch => {
    return dispatch(saveSettingsToDB(category, settings));
  };  
}

export function addPaymentGateway(gateway) {
  return {
    type: ADD_PAYMENT_GATEWAY,
    gateway
  };
}

export function removePaymentGateway(gateway) {
  return {
    type: REMOVE_PAYMENT_GATEWAY,
    gateway
  };
}

export function updatePaymentGateway(gateway) {
  return {
    type: UPDATE_PAYMENT_GATEWAY,
    gateway
  };
}
