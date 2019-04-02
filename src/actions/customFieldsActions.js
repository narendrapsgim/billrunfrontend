import { List } from 'immutable';
import {
  getSettings,
  saveSettings,
  pushToSetting,
  updateSetting,
  removeSettingField,
} from './settingsActions';
import {
  setPageFlag,
  setFormModalError,
} from './guiStateActions/pageActions';
import {
  customFieldsEntityFieldsSelector,
} from '@/selectors/customFieldsSelectors';
import {
  getSettingsPath,
  getConfig,
} from '@/common/Util';


export const getFields = entity => (dispatch) => {
  const entitysFields = (Array.isArray(entity) ? entity : [entity]).map(entityName => getSettingsPath(entityName, false, ['fields']));
  return dispatch(getSettings(entitysFields));
};

export const saveFields = (entity = '') => (dispatch) => {
  const entitysFields = (Array.isArray(entity) ? entity : [entity]).map(entityName => getSettingsPath(entityName, false, ['fields']));
  return dispatch(saveSettings(entitysFields));
};

export const addField = (entity, field) => (dispatch) => {
  const [entityName, ...pathToField] = getSettingsPath(entity, true, ['fields']);
  return dispatch(pushToSetting(entityName, field, pathToField));
};

export const updateField = (entity, field) => (dispatch, getState) => {
  const fields = customFieldsEntityFieldsSelector(getState(), {}, entity);
  const index = fields.findIndex(f => f.getIn(['field_name'], '') === field.getIn(['field_name'], ''));
  if (index !== -1) {
    const [entityName, ...pathToField] = getSettingsPath(entity, true, ['fields', index]);
    return dispatch(updateSetting(entityName, pathToField, field));
  }
  return false;
};

export const removeField = (entity, field) => (dispatch, getState) => {
  const fields = customFieldsEntityFieldsSelector(getState(), {}, entity);
  const index = fields.findIndex(f => f.getIn(['field_name'], '') === field.getIn(['field_name'], ''));
  if (index !== -1) {
    const [entityName, ...pathToField] = getSettingsPath(entity, true, ['fields', index]);
    return dispatch(removeSettingField(entityName, pathToField));
  }
  return false;
};

export const saveAndReloadFields = entity => dispatch => dispatch(saveFields(entity))
  .then(success => (success.status ? true : Promise.reject()))
  .then(() => dispatch(getFields(entity)))
  .catch(() => dispatch(getFields(entity)).then(() => Promise.reject()));

export const setFlag = (key, value) => setPageFlag('customFields', key, value);

export const removeFlag = key => setPageFlag('customFields', key);

export const removeFlags = () => setPageFlag('customFields');

export const validateFieldTitle = (value = '') => {
  if (value === '') {
    return 'Title is required';
  }
  return true;
};

export const validateFieldKey = (value = '', existingFields = List()) => {
  if (!getConfig('keyRegex', '').test(value)) {
    return 'Key contains illegal characters, field name should contain only alphabets, numbers and underscores (A-Z, a-z, 0-9, _)';
  }
  if (value === '') {
    return 'Key is required';
  }
  if (existingFields.includes(value)) {
    return 'Key already exists';
  }
  return true;
};

export const validateField = (field, usedNames) => (dispatch) => {
  let isValid = true;
  const titleValid = validateFieldTitle(field.get('title', ''));
  if (titleValid !== true) {
    isValid = false;
    dispatch(setFormModalError('title', titleValid));
  }

  const keyValid = validateFieldKey(field.get('field_name', ''), usedNames);
  if (keyValid !== true) {
    isValid = false;
    dispatch(setFormModalError('fieldName', keyValid));
  }
  return isValid;
};
