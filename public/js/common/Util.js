import _ from 'lodash';

export function titlize(str) {
  return _.capitalize(str.replace(/_/g, ' '));
}
