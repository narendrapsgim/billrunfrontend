import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { showSuccess, showDanger } from './alertsActions';

export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';
export const ADD_PAYMENT_GATEWAY = 'ADD_PAYMENT_GATEWAY';
export const REMOVE_PAYMENT_GATEWAY = 'REMOVE_PAYMENT_GATEWAY';
export const UPDATE_PAYMENT_GATEWAY = 'UPDATE_PAYMENT_GATEWAY';


export function addPaymentGateway(gateway) {
  return {
    type: ADD_PAYMENT_GATEWAY,
    gateway,
  };
}

export function removePaymentGateway(gateway) {
  return {
    type: REMOVE_PAYMENT_GATEWAY,
    gateway,
  };
}

export function updatePaymentGateway(gateway) {
  return {
    type: UPDATE_PAYMENT_GATEWAY,
    gateway,
  };
}

export function updateSetting(category, name, value) {
  return {
    type: UPDATE_SETTING,
    category,
    name,
    value,
  };
}

function gotSettings(settings) {
  return {
    type: GOT_SETTINGS,
    settings,
  };
}

function fetchSettings(categories) {
  const queries = categories.map(category => ({
    api: 'settings',
    name: category,
    params: [{ category }, { data: JSON.stringify({}) }],
  }));

  return (dispatch) => {
    apiBillRun(queries).then(
      (success) => {
        dispatch(gotSettings(success.data));
      }
    ).catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
    });
  };
}

function saveSettingsToDB(categories, settings) {
  const queries = categories.map((category) => {
    let data = settings.get(category);
    if (category === 'pricing') {
      data = data.set('vat', data.get('vat') / 100);
    }
    return ({
      api: 'settings',
      name: category,
      params: [
        { category },
        { action: 'set' },
        { data: JSON.stringify(data) },
      ],
    });
  });

  return (dispatch) => {
    apiBillRun(queries).then(
      (success) => {
        dispatch(showSuccess('Settings saved successfuly!'));
      }
    ).catch((error) => {
      dispatch(apiBillRunErrorHandler(error, 'Error saving settings'));
    });
  };
}


export function getSettings(categories = []) {
  if (!Array.isArray(categories)) {
    categories = [categories];
  }
  return (dispatch) => {
    return dispatch(fetchSettings(categories));
  };
}

export function saveSettings(categories = []) {
  if (!Array.isArray(categories)) {
    categories = [categories];
  }
  return (dispatch, getState) => {
    const { settings } = getState();
    return dispatch(saveSettingsToDB(categories, settings));
  };
}
