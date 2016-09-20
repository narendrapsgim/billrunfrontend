export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';
export const SELECT_PAYMENT_GATEWAY = 'SELECT_PAYMENT_GATEWAY';
export const DESELECT_PAYMENT_GATEWAY = 'DESELECT_PAYMENT_GATEWAY';
export const CHANGE_PAYMENT_GATEWAY_PARAM = 'CHANGE_PAYMENT_GATEWAY_PARAM';

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

function saveSettingsToDB(category, settings) {
  const data = settings.get(category).toJS();
  if (category === "pricing") {
    data.vat = data.vat / 100;
  }
  const query = {
    api: "settings",
    params: [
      { category: category },
      { action: "set" },
      { data: JSON.stringify(data) }
    ]
  };

  return (dispatch) => {
    apiBillRun(query).then(
      success => {
        dispatch(showSuccess("Settings saved successfuly!", "success"));
      },
      failure => {
        console.log(failure);
        console.log('failed!');
        dispatch(showDanger("Error saving settings", "error"));
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

export function selectPaymentGateway(gateway_name, checked) {
  const type = checked ? SELECT_PAYMENT_GATEWAY : DESELECT_PAYMENT_GATEWAY;
  return {
    type,
    gateway_name
  };
}

export function changePaymentGatewayParam(gateway_name, param, value) {
  return {
    type: CHANGE_PAYMENT_GATEWAY_PARAM,
    gateway_name,
    param,
    value
  };
}
