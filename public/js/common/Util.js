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
    case 'create':
      return `Create New ${changeCase.upperCaseFirst(entityName)}`;
    case 'closeandnew': {
      const uniqueField = globalSetting.systemItems[entityName].uniqueField;
      const itemType = globalSetting.systemItems[entityName].itemType;
      return `Edit ${itemType} - ${item.get(uniqueField, '')}`;
    }
    case 'view': {
      const uniqueField = globalSetting.systemItems[entityName].uniqueField;
      const itemType = globalSetting.systemItems[entityName].itemType;
      return `${changeCase.upperCaseFirst(itemType)} - ${item.get(uniqueField, '')}`;
    }
    case 'update': {
      const uniqueField = globalSetting.systemItems[entityName].uniqueField;
      const itemType = globalSetting.systemItems[entityName].itemType;
      return `Update ${itemType} - ${item.get(uniqueField, '')}`;
    }
    default:
      return '';
  }
};

export const getItemDateValue = (item, fieldName, defaultValue = moment()) => {
  let value = item.get(fieldName, false);
  if (!value) {
    return defaultValue;
  }
  if (value && typeof value === 'string') {
    return moment(value);
  }
  value = item.getIn([fieldName, 'sec'], false);
  if (value && typeof value === 'number') {
    return moment.unix(value);
  }
  return defaultValue;
};
