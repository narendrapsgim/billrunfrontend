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
    case 'closeandnew':
      return `Edit ${entityName} - ${item.get('name')}`;
    case 'view':
      return `${changeCase.upperCaseFirst(entityName)} - ${item.get('name')}`;
    case 'update':
      return `Update ${entityName} - ${item.get('name')}`;
    default:
      return '';
  }
};
