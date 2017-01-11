import _ from 'lodash';
import FieldNames from '../FieldNames';

export function titlize(str) {
  return _.capitalize(str.replace(/_/g, ' '));
}

export function getFieldName(field, category) {
  if (FieldNames[category]) return FieldNames[category][field] || field;
  return FieldNames[field] || field;
}


export function range(n = 1) {
  return Array.apply(null, new Array(n));
}

export function times(n = 1, fn = () => {}) {
  return range(n).map(fn);
}
