import moment from 'moment';
import { startProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import {
  saveSettingsQuery,
  getSettingsQuery,
  saveFileQuery,
  getFileQuery,
  getCurrenciesQuery,
  saveSharedSecretQuery,
  disableSharedSecretQuery,
} from '../common/ApiQueries';


export const UPDATE_SETTING = 'UPDATE_SETTING';
export const GOT_SETTINGS = 'GOT_SETTINGS';
export const ADD_PAYMENT_GATEWAY = 'ADD_PAYMENT_GATEWAY';
export const REMOVE_PAYMENT_GATEWAY = 'REMOVE_PAYMENT_GATEWAY';
export const UPDATE_PAYMENT_GATEWAY = 'UPDATE_PAYMENT_GATEWAY';
export const REMOVE_SETTING_FIELD = 'REMOVE_SETTING_FIELD';
export const PUSH_TO_SETTING = 'PUSH_TO_SETTING';
export const SET_FIELD_POSITION = 'SET_FIELD_POSITION';

export const addPaymentGateway = gateway => ({
  type: ADD_PAYMENT_GATEWAY,
  gateway,
});

export const removePaymentGateway = gateway => ({
  type: REMOVE_PAYMENT_GATEWAY,
  gateway,
});

export const updatePaymentGateway = gateway => ({
  type: UPDATE_PAYMENT_GATEWAY,
  gateway,
});

export const updateSetting = (category, name, value) => ({
  type: UPDATE_SETTING,
  category,
  name,
  value,
});

export const pushToSetting = (category, value, path = null) => ({
  type: PUSH_TO_SETTING,
  category,
  path,
  value,
});

export const removeSettingField = (category, name) => ({
  type: REMOVE_SETTING_FIELD,
  category,
  name,
});

const gotSettings = settings => ({
  type: GOT_SETTINGS,
  settings,
});

const gotFile = (fileData, path) => {
  const value = `data:image/png;base64,${fileData}`;
  return updateSetting('files', path, value);
};

export const setFieldPosition = (oldIndex, newIndex, path) => ({
  type: SET_FIELD_POSITION,
  oldIndex,
  newIndex,
  path,
});

export const saveFile = (file, metadata = {}) => {
  const query = saveFileQuery(file, metadata);
  return apiBillRun(query);
};

export const fetchFile = (query, path = 'file') => (dispatch) => {
  const dataImage = localStorage.getItem(path);
  if (dataImage) {
    return dispatch(gotFile(dataImage, path));
  }
  const apiQuery = getFileQuery(query);
  return apiBillRun(apiQuery)
    .then((success) => {
      if (success.data && success.data[0] && success.data[0].data && success.data[0].data.desc) {
        localStorage.setItem(path, success.data[0].data.desc);
        dispatch(gotFile(success.data[0].data.desc, path));
        return true;
      }
      return success;
    })
    .catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
      return error;
    });
};

export const saveSettings = (categories = [], messages = {}) => (dispatch, getState) => {
  const {
    success: successMessage = 'Settings saved successfuly!',
    error: errorMessage = 'Error saving settings',
  } = messages;
  dispatch(startProgressIndicator());
  const { settings } = getState();
  const categoriesArray = Array.isArray(categories) ? categories : [categories];
  const multipleCategories = categoriesArray.length > 1;
  const categoryData = categoriesArray.map((category) => {
    let data = settings.getIn(category.split('.'));
    if (category === 'taxation') {
      data = data.set('vat', data.get('vat') / 100);
    }
    return (multipleCategories) ? { [category]: data } : data;
  });
  const category = multipleCategories ? 'ROOT' : categories[0];
  const data = multipleCategories ? categoryData : categoryData[0];
  const queries = saveSettingsQuery(data, category);

  return apiBillRun(queries)
    .then(success => dispatch(apiBillRunSuccessHandler(success, successMessage)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, errorMessage)));
};

export const getSettings = (categories = []) => (dispatch) => {
  const categoriesArray = (Array.isArray(categories)) ? categories : [categories];
  const queries = categoriesArray.map(category => getSettingsQuery(category));
  return apiBillRun(queries)
    .then((success) => {
      dispatch(gotSettings(success.data));
      return true;
    })
    .catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
      return false;
    });
};

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

export const saveSharedSecret = (secret, mode) => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = (mode === 'remove') ? disableSharedSecretQuery(secret) : saveSharedSecretQuery(secret);
  return apiBillRun(query)
    .then((success) => {
      let action = (['create'].includes(mode)) ? 'created' : '';
      if (action === '') {
        action = (['remove'].includes(mode)) ? 'removed' : 'updated';
      }
      return dispatch(apiBillRunSuccessHandler(success, `The secret key was ${action}`));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error saving Secret')));
};
