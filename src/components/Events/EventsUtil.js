import Immutable from 'immutable';
import getSymbolFromCurrency from 'currency-symbol-map';
import { getConfig, getUnitLabel } from '@/common/Util';


export const getBalanceConditionData = conditionName =>
  getConfig(['events', 'operators', 'balance', 'conditions'], Immutable.Map())
    .find(condType => condType.get('id', '') === conditionName, null, Immutable.Map());

export const buildBalanceConditionPath = (trigger, limitation, params = {}) => {
  switch (limitation) {
    case 'group':
      return `balance.groups.${params.groupName}.${trigger}`;
    case 'activity_type':
      if (params.hasOwnProperty('overGroup') && params.overGroup === 'over_group') {
        return `balance.totals.${params.activityType}.over_group.${trigger}`;
      }
      return `balance.totals.${params.activityType}.${trigger}`;
    case 'none':
    default:
      return 'balance.cost';
  }
};

export const getTriggerFromBalanceConditionPath = path => path.substr(path.lastIndexOf('.') + 1);

export const getLimitationFromBalanceConditionPath = (path) => {
  if (path.indexOf('.groups.') !== -1) {
    return 'group';
  }
  if (path.indexOf('.totals.') !== -1) {
    return 'activity_type';
  }
  return 'none';
};

export const getOverGroupFromBalanceConditionPath = (path) => {
  if (path.indexOf('.over_group.') !== -1) {
    return 'over_group';
  }
  return 'none';
};

export const getActivityTypeFromBalanceConditionPath = (path, limitation) => {
  if (limitation !== 'activity_type') {
    return '';
  }
  const limit = getOverGroupFromBalanceConditionPath(path) === 'over_group'
    ? path.lastIndexOf('.over_group')
    : path.lastIndexOf('.');
  return path.substring(path.lastIndexOf('.totals.') + 8, limit);
};

export const getGroupFromBalanceConditionPath = (path, limitation) =>
  (limitation === 'group' ? path.substring(path.lastIndexOf('.groups.') + 8, path.lastIndexOf('.')) : '');

export const getPathParams = (path) => {
  const limitation = getLimitationFromBalanceConditionPath(path);
  const overGroup = getOverGroupFromBalanceConditionPath(path);
  return {
    trigger: getTriggerFromBalanceConditionPath(path),
    limitation,
    overGroup,
    activityType: getActivityTypeFromBalanceConditionPath(path, limitation),
    groupName: getGroupFromBalanceConditionPath(path, limitation),
  };
};

export const getBalanceConditionName = condition =>
  getBalanceConditionData(condition.get('type', '')).get('title', '');

export const getUnitTitle = (unit, trigger, usaget, propertyTypes, usageTypesData, currency) => // eslint-disable-line max-len
  (trigger === 'usagev' || unit !== '' ? getUnitLabel(propertyTypes, usageTypesData, usaget, unit) : getSymbolFromCurrency(currency));

export const getConditionValue = (condition, params) => {
  const { trigger, limitation, activityType } = getPathParams(condition.get('path', ''));
  const usaget = (limitation === 'group' ? condition.get('usaget', '') : activityType);
  return `${condition.get('value', '')} ${getUnitTitle(condition.get('unit', ''), trigger, usaget, params.propertyTypes, params.usageTypesData, params.currency)}`;
};

export const getConditionDescription = (conditionType, condition, params) => {
  const { trigger, limitation, activityType, groupName } = getPathParams(condition.get('path', ''));
  let pref = trigger === 'usagev' ? 'Usage' : 'Cost';
  if (condition && condition.get('path', '').indexOf('over_group') !== -1) {
    pref = `Exceeding ${pref.toLowerCase()}`;
  }
  switch (limitation) {
    case 'group':
      return `${pref} of group ${groupName} ${getBalanceConditionName(condition)} ${getConditionValue(condition, params)}`;
    case 'activity_type':
      return `${pref} of ${activityType} activity ${getBalanceConditionName(condition)} ${getConditionValue(condition, params)}`;
    case 'none':
    default:
      return `Total cost ${getBalanceConditionName(condition)} ${getConditionValue(condition, params)}`;
  }
};

export const gitPeriodLabel = (value) => {
  switch (value) {
    case 'minutely':
      return 'Minutes';
    case 'hourly':
      return 'Hours';
    default:
      return 'Select unit...';
  }
};

export const gitTimeOptions = (value) => {
  if (value === 'minutely') {
    return [{ value: 15, label: '15' }, { value: 30, label: '30' }];
  }
  if (value === 'hourly') {
    return Array.from(new Array(24), (v, k) => k + 1).map(v => ({ value: v, label: `${v}` }));
  }
  return [];
};
