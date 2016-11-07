import _ from 'lodash';
import FieldNames from '../FieldNames';

export function titlize(str) {
  return _.capitalize(str.replace(/_/g, ' '));
}

export function getFieldName(field, collection) {
  if (FieldNames[collection]) return FieldNames[collection][field] || field;
  return FieldNames[field] || field;
}
