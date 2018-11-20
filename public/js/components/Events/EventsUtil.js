import Immutable from 'immutable';
import getSymbolFromCurrency from 'currency-symbol-map';
import { getConfig, getUnitLabel, getValueByUnit } from '../../common/Util';

export const getConditionTypes = () => (getConfig(['events', 'conditions'], Immutable.Map()).map(condType => (
  { value: condType.get('key', ''), label: condType.get('title', '') })).toArray()
);

export const getConditionData = conditionName =>
  (getConfig(['events', 'conditions'], Immutable.Map()).find(condType => condType.get('key', '') === conditionName) || Immutable.Map());

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

export const getConditionName = condition => (
  (getConfig('events', Immutable.Map).get('conditions', Immutable.List()).find(cond => cond.get('key', '') === condition.get('type', '')) || Immutable.Map()).get('title', '')
);

export const getConditionPath = condition => (
  condition.get('path', '')
);

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
      return `${pref} of group ${groupName} ${getConditionName(condition)} ${getConditionValue(condition, params)}`;
    case 'activity_type':
      return `${pref} of ${activityType} activity ${getConditionName(condition)} ${getConditionValue(condition, params)}`;
    case 'none':
    default:
      return `Total cost ${getConditionName(condition)} ${getConditionValue(condition, params)}`;
  }
};

export const getEventConvertedConditions = (propertyTypes, usageTypes, item, toBaseUnit = true) => {
  const convertedConditions = item.get('conditions', Immutable.List()).withMutations((conditionsWithMutations) => {
    conditionsWithMutations.forEach((cond, index) => {
      const unit = cond.get('unit', '');
      const usaget = cond.get('usaget', '');
      if (unit !== '' && usaget !== '') {
        const value = cond.get('value', 0);
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        conditionsWithMutations.setIn([index, 'value'], newValue);
      }
    });
  });
  return !convertedConditions.isEmpty()
    ? convertedConditions
    : Immutable.List();
};
