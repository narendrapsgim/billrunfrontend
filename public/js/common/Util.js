import _ from 'lodash';

export function titlize(str) {
  return _.capitalize(str.replace(/_/g, ' '));
}

export function range(n = 1) {
  return Array.apply(null, new Array(n));
}

export function times(n = 1, fn = () => {}) {
  return range(n).map(fn);
}
