import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator } from './progressIndicatorActions';
import { getCurrenciesQuery } from '../common/ApiQueries';
import { showSuccess } from './alertsActions';

export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';
export const ADD_PAYMENT_GATEWAY = 'ADD_PAYMENT_GATEWAY';
export const REMOVE_PAYMENT_GATEWAY = 'REMOVE_PAYMENT_GATEWAY';
export const UPDATE_PAYMENT_GATEWAY = 'UPDATE_PAYMENT_GATEWAY';
export const REMOVE_SETTING_FIELD = 'REMOVE_SETTING_FIELD';
export const PUSH_TO_SETTING = 'PUSH_TO_SETTING';
export const SET_FIELD_POSITION = 'SET_FIELD_POSITION';

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

export function pushToSetting(category, value, path = null) {
  return {
    type: PUSH_TO_SETTING,
    category,
    path,
    value,
  };
}

export function removeSettingField(category, name) {
  return {
    type: REMOVE_SETTING_FIELD,
    category,
    name
  };
}

function gotSettings(settings) {
  return {
    type: GOT_SETTINGS,
    settings,
  };
}

function gotFile(fileData, path) {
  return {
    type: UPDATE_SETTING,
    category: 'files',
    name: path,
    value: `data:image/png;base64,${fileData}`,
  };
}

function fetchSettings(categories) {
  const queries = categories.map(category => ({
    api: 'settings',
    name: category,
    params: [{ category }, { data: JSON.stringify({}) }],
  }));

  return dispatch => apiBillRun(queries).then(
    (success) => {
      dispatch(gotSettings(success.data));
      return true;
    }).catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
      return false;
    });
}

export function saveFile(file, metadata = {}) {
  const formData = new FormData();
  formData.append('action', 'save');
  formData.append('metadata', JSON.stringify(metadata));
  formData.append('query', JSON.stringify({ filename: 'file' }));
  formData.append('file', file);

  const query = {
    api: 'files',
    name: 'saveFile',
    options: {
      method: 'POST',
      body: formData,
    },
  };
  return apiBillRun(query);
}

export function fetchFile(query, path = 'file') {
  const dataImage = localStorage.getItem(path);
  if (dataImage) {
    return dispatch => dispatch(gotFile(dataImage, path));
  }

  const apiQuery = {
    api: 'files',
    params: [
      { action: 'read' },
      { query: JSON.stringify(query) },
    ],
  };
  return dispatch => apiBillRun(apiQuery).then(
    (success) => {
      if (success.data && success.data[0] && success.data[0].data && success.data[0].data.desc) {
        localStorage.setItem(path, success.data[0].data.desc);
        dispatch(gotFile(success.data[0].data.desc, path));
        return true;
      }
      return success;
    }).catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
      return error;
    });
}

function saveSettingsToDB(categories, settings) {
  const multipleCategories = categories.length > 1;
  const categoryData = categories.map((category) => {
    let data = settings.getIn(category.split('.'));
    if (category === 'pricing') {
      data = data.set('vat', data.get('vat') / 100);
    }
    if (multipleCategories) {
      return ({ [category]: data });
    }
    return data;
  });

  const category = multipleCategories ? 'ROOT' : categories[0];
  const data = multipleCategories ? categoryData : categoryData[0];

  const queries = ({
    api: 'settings',
    name: categories.join(','),
    params: [
      { category },
      { action: 'set' },
      { data: JSON.stringify(data) },
    ],
  });

  return (dispatch) => {
    return apiBillRun(queries).then(
      (success) => {
        dispatch(showSuccess('Settings saved successfuly!'));
        return true;
      }
    ).catch((error) => {
      dispatch(apiBillRunErrorHandler(error, 'Error saving settings'));
      return false;
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

export function setFieldPosition(oldIndex, newIndex, path) {
  return {
    type: SET_FIELD_POSITION,
    oldIndex,
    newIndex,
    path,
  };
}

export const getCurrencies = () => (dispatch) => {
  const now = moment();
  const cacheForMinutes = 60;
  const cacheKey = 'currencies-options';
  const cache = JSON.parse(localStorage.getItem(cacheKey));
  if (cache && moment(cache.time).add(cacheForMinutes, 'minutes').isAfter(now)) {
    return Promise.resolve(cache.data);
  }
  dispatch(startProgressIndicator());
  const query = getCurrenciesQuery();
  return apiBillRun(query)
    .then((success) => {
      const data = dispatch(apiBillRunSuccessHandler(success));
      localStorage.setItem(cacheKey, JSON.stringify({ time: now, data }));
      return data;
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving currencies')));
};
