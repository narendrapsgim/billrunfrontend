import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import FieldNames from '../FieldNames';

/**
 * Get data from globalSettings.js file
 * @param  {[String/Array of strings]} key/path in globalSettings
 * @param  {[Any]} [defaultValue=null] If key/Path not exist
 * @return {[Any]} Value from globalSettings.js or default value if key/path not exist
 */
export const getConfig = (key, defaultValue = null) => {
  const path = Array.isArray(key) ? key : [key];
  return Immutable.fromJS(globalSetting).getIn(path, defaultValue);
};

export const titlize = str => changeCase.upperCaseFirst(str);

export const getFieldName = (field, category) => {
  if (FieldNames[category]) {
    return FieldNames[category][field] || field;
  }
  return FieldNames[field] || field;
};

export const getZiroTimeDate = (date = moment()) => {
  const dateWithoutTime = moment(date).utcOffset(0);
  dateWithoutTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  return dateWithoutTime;
};

export const buildPageTitle = (mode, entityName, item = Immutable.Map()) => {
  switch (mode) {
    case 'create': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `Create New ${changeCase.upperCaseFirst(entitySettings.get('itemName', entitySettings.get('itemType', '')))}`;
      }
      return 'Create';
    }

    case 'closeandnew': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `Edit ${entitySettings.get('itemName', entitySettings.get('itemType', ''))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'Edit';
    }

    case 'view': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `${changeCase.upperCaseFirst(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'View';
    }

    case 'update': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `Update ${entitySettings.get('itemName', entitySettings.get('itemType', ''))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'Update';
    }
    default:
      return '';
  }
};

export const getItemDateValue = (item, fieldName, defaultValue = moment()) => {
  const dateString = item.get(fieldName, false);
  if (typeof dateString === 'string') {
    return moment(dateString);
  }
  const dateUnix = item.getIn([fieldName, 'sec'], false);
  if (typeof dateUnix === 'number') {
    return moment.unix(dateUnix);
  }
  return defaultValue;
};

export const isItemClosed = (item) => {
  const toTime = getItemDateValue(item, 'to');
  return toTime.isAfter(moment()) && toTime.isBefore(moment().add(50, 'years'));
};
