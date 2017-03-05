import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import FieldNames from '../FieldNames';


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
      if (entityName) {
        return `Create New ${changeCase.upperCaseFirst(entityName)}`;
      }
      return 'Create';
    }

    case 'closeandnew': {
      const entitySettings = globalSetting.systemItems[entityName];
      if (entitySettings) {
        return `Edit ${entitySettings.itemType} - ${item.get(entitySettings.uniqueField, '')}`;
      }
      return 'Edit';
    }

    case 'view': {
      const entitySettings = globalSetting.systemItems[entityName];
      if (entitySettings) {
        return `${changeCase.upperCaseFirst(entitySettings.itemType)} - ${item.get(entitySettings.uniqueField, '')}`;
      }
      return 'View';
    }

    case 'update': {
      const entitySettings = globalSetting.systemItems[entityName];
      if (entitySettings) {
        return `Update ${entitySettings.itemType} - ${item.get(entitySettings.uniqueField, '')}`;
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
