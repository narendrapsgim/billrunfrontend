import Immutable from 'immutable';
import moment from 'moment';
import isNumber from 'is-number';
import { titleCase, sentenceCase, upperCaseFirst } from 'change-case';
import fieldNamesConfig from '../config/fieldNames.json';
import reportConfig from '../config/report';
import systemItemsConfig from '../config/entities.json';
import mainMenu from '../config/mainMenu.json';
import eventsConfig from '../config/events.json';
import ratesConfig from '../config/rates.json';
import collectionsConfig from '../config/collections.json';

/**
 * Get data from config files
 * @param  {[String/Array of strings]} key/path in config
 * @param  {[Any]} [defaultValue=null] If key/Path not exist
 * @return {[Any]} Value from config or default value if key/path not exist
 */

let configCache = Immutable.Map();
export const getConfig = (key, defaultValue = null) => {
  const path = Array.isArray(key) ? key : [key];
  if (configCache.isEmpty()) {
    configCache = Immutable.fromJS(globalSetting);
  }
  if (!configCache.has(path[0])) {
    switch (path[0]) {
      case 'reports': configCache = configCache.set('reports', Immutable.fromJS(reportConfig));
        break;
      case 'fieldNames': configCache = configCache.set('fieldNames', Immutable.fromJS(fieldNamesConfig));
        break;
      case 'systemItems': configCache = configCache.set('systemItems', Immutable.fromJS(systemItemsConfig));
        break;
      case 'mainMenu': configCache = configCache.set('mainMenu', Immutable.fromJS(mainMenu));
        break;
      case 'events': configCache = configCache.set('events', Immutable.fromJS(eventsConfig));
        break;
      case 'rates': configCache = configCache.set('rates', Immutable.fromJS(ratesConfig));
        break;
      case 'collections': configCache = configCache.set('collections', Immutable.fromJS(collectionsConfig));
        break;
      default: console.log(`Config caregory not exists ${path}`);
    }
  }
  return configCache.getIn(path, defaultValue);
};

export const titlize = str => upperCaseFirst(str);

export const getFieldName = (field, category, defaultValue = null) =>
  getConfig(['fieldNames', category, field], getConfig(['fieldNames', field], defaultValue !== null ? defaultValue : field));

export const getFieldNameType = (type) => {
  switch (type) {
    case 'account':
    case 'customer':
      return 'account';
    case 'subscription':
    case 'subscriptions':
    case 'subscribers':
    case 'subscriber':
      return 'subscription';
    case 'lines':
    case 'usage':
      return 'lines';
    case 'service':
    case 'services':
      return 'service';
    case 'plan':
    case 'plans':
      return 'plan';
    case 'product':
    case 'products':
      return 'product';
    default:
      return type;
  }
};

export const getZiroTimeDate = (date = moment()) => {
  const dateWithoutTime = moment(date).utcOffset(0);
  dateWithoutTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  return dateWithoutTime;
};

export const getFirstName = item => item.get('first_name', item.get('firstname', ''));

export const getLastName = item => item.get('last_name', item.get('lastname', ''));

export const getCustomerId = item => item.get('aid', '');

export const getSubscriberId = item => item.get('sid', '');

export const buildPageTitle = (mode, entityName, item = Immutable.Map()) => {
  switch (mode) {
    case 'clone':
    case 'create': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `Create New ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))}`;
      }
      return 'Create';
    }

    case 'loading':
    case 'closeandnew': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (entityName === 'customer') {
          return `Edit ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getCustomerId(item)}]`;
        } else if (entityName === 'subscription') {
          return `Edit ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getSubscriberId(item)}]`;
        } else if (entityName === 'auto_renew') {
          return `Edit ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))}`;
        }
        return `Edit ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'Edit';
    }

    case 'view': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (entityName === 'customer') {
          return `${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getCustomerId(item)}]`;
        } else if (entityName === 'subscription') {
          return `${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getSubscriberId(item)}]`;
        }
        return `${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'View';
    }

    case 'update': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (entityName === 'customer') {
          return `Update ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getCustomerId(item)}]`;
        } else if (entityName === 'subscription') {
          return `Update ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getSubscriberId(item)}]`;
        }
        return `Update ${titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'Update';
    }
    default:
      return '';
  }
};

export const getItemDateValue = (item, fieldName, defaultValue = moment()) => {
  if (Immutable.Map.isMap(item)) {
    const dateString = item.get(fieldName, false);
    if (typeof dateString === 'string') {
      return moment(dateString);
    }
    const dateUnix = item.getIn([fieldName, 'sec'], false);
    if (typeof dateUnix === 'number') {
      return moment.unix(dateUnix);
    }
  }
  return defaultValue;
};

export const getItemId = (item, defaultValue = null) => {
  if (Immutable.Map.isMap(item)) {
    return item.getIn(['_id', '$id'], defaultValue);
  }
  return defaultValue;
};

export const isItemClosed = (item) => {
  const earlyExpiration = item.getIn(['revision_info', 'early_expiration'], null);
  if (earlyExpiration !== null) {
    return earlyExpiration;
  }
  const toTime = getItemDateValue(item, 'to');
  return toTime.isAfter(moment()) && toTime.isBefore(moment().add(50, 'years'));
};

export const isItemReopened = (item, prevItem) => {
  const currentFrom = getItemDateValue(item, 'from', false);
  const prevTo = getItemDateValue(prevItem, 'to', false);
  if (!currentFrom || !prevTo) {
    return false;
  }

  return currentFrom.isAfter(prevTo.add(1, 'days'));
};

export const isItemFinite = (item, toField = 'to') => {
  const toTime = getItemDateValue(item, toField);
  return toTime.isBefore(moment().add(50, 'years'));
};

export const getItemMode = (item, undefindItemStatus = 'create') => {
  if (Immutable.Map.isMap(item)) {
    if (getItemId(item, null) === null) {
      return 'create';
    }
    const status = item.getIn(['revision_info', 'status'], '');
    const isLast = item.getIn(['revision_info', 'is_last'], true);
    if (['expired'].includes(status) || (status === 'active' && !isLast)) {
      return 'view';
    }
    if (['future'].includes(status) || isItemClosed(item)) {
      return 'update';
    }
    return 'closeandnew';
  }
  return undefindItemStatus;
};

export const getItemMinFromDate = (item, minDate) => {
  // item and minDate
  if (minDate && getItemId(item, false)) {
    return moment.max(minDate, getItemDateValue(item, 'originalValue', getItemDateValue(item, 'from', moment(0))));
  }
  // only item
  if(getItemId(item, false)) {
    return getItemDateValue(item, 'originalValue', getItemDateValue(item, 'from', moment(0)));
  }
  // only minDate
  if (minDate) {
    return minDate;
  }
  // allow component set default value if no item and minDate exist
  return undefined;
};

export const getRevisionStartIndex = (item, revisions) => {
  const index = revisions.findIndex(revision => getItemId(revision) === getItemId(item));
  if (index <= 0) {
    return 0;
  }
  if (index + 1 === revisions.size) {
    return ((index - 2) >= 0) ? index - 2 : 0;
  }
  return index - 1;
};

export const formatSelectOptions = option => (
  Immutable.Map.isMap(option)
    ? ({ value: option.get('value', ''), label: option.get('label', '') })
    : ({ value: option, label: sentenceCase(option) })
);

export const parseConfigSelectOptions = configOption => formatSelectOptions(
  configOption.has('title')
    ? Immutable.Map({ value: configOption.get('id'), label: configOption.get('title') })
    : configOption.get('id')
);

export const isLinkerField = (field = Immutable.Map()) => (
  field.get('unique', false) &&
  !field.get('generated', false) &&
  field.get('editable', true)
);

export const createReportColumnLabel = (label, fieldsOptions, opOptions, oldField, oldOp, newField, newOp) => {
  const oldFieldLabel = oldField === '' ? '' : fieldsOptions.find(
    fieldConfig => fieldConfig.get('id') === oldField, null, Immutable.Map({ title: newField }),
  ).get('title', '');
  const newFieldLabel = oldField === newField ? oldFieldLabel : fieldsOptions.find(
    fieldConfig => fieldConfig.get('id') === newField, null, Immutable.Map({ title: newField }),
  ).get('title', '');

  const oldOpLabel = oldOp === '' ? '' : opOptions.find(
    groupByOperator => groupByOperator.get('id') === oldOp, null, Immutable.Map(),
  ).get('title', '');
  const newOpLabel = oldOp === newOp ? oldOpLabel : opOptions.find(
    groupByOperator => groupByOperator.get('id') === newOp, null, Immutable.Map(),
  ).get('title', '');
  // Check if label is empty or was NOT changed by user
  const oldLabel = oldOpLabel === '' || oldOp === 'group' ? oldFieldLabel : `${oldFieldLabel} (${oldOpLabel})`;
  if (label === '' || label === oldLabel) {
    return newOpLabel === '' || newOp === 'group' ? newFieldLabel : `${newFieldLabel} (${newOpLabel})`;
  }
  return label;
};

export const getEntitySettingsName = (entityName) => {
  if (entityName === 'account') {
    return 'customer';
  }
  if (entityName === 'subscriber') {
    return 'subscription';
  }
  return entityName;
};

export const getSettingsKey = (entityName) => {
  const key = getConfig(['systemItems', getEntitySettingsName(entityName), 'settingsKey']);
  return (key ? key.split('.')[0] : entityName);
};

export const getSettingsPath = (entityName, path) => {
  const key = getConfig(['systemItems', getEntitySettingsName(entityName), 'settingsKey']);
  if (!key) {
    return path;
  }

  const keysArr = key.split('.');
  if (typeof keysArr[1] !== 'undefined') {
    path.unshift(keysArr[1]);
  }
  return path;
};

export const getRateByKey = (rates, rateKey) => rates.find(rate => rate.get('key', '') === rateKey) || Immutable.Map();

export const getRateUsaget = rate => rate.get('rates', Immutable.Map()).keySeq().first() || '';

export const getRateUsagetByKey = (rates, rateKey) => getRateUsaget(getRateByKey(rates, rateKey));

export const getRateUnit = (rate, usaget) => rate.getIn(['rates', usaget, 'BASE', 'rate', 0, 'uom_display', 'range'], '');

export const getUom = (propertyTypes, usageTypes, usaget) => {
  const selectedUsaget = usageTypes.find(usageType => usageType.get('usage_type', '') === usaget) || Immutable.Map();
  return (propertyTypes.find(prop => prop.get('type', '') === selectedUsaget.get('property_type', '')) || Immutable.Map()).get('uom', Immutable.List());
};

export const getUsagePropertyType = (usageTypesData, usage) =>
  (usageTypesData.find(usaget => usaget.get('usage_type', '') === usage) || Immutable.Map()).get('property_type', '');

export const getUnitLabel = (propertyTypes, usageTypes, usaget, unit) => {
  const uom = getUom(propertyTypes, usageTypes, usaget);
  return (uom.find(propertyType => propertyType.get('name', '') === unit) || Immutable.Map()).get('label', '');
};

export const getValueByUnit = (propertyTypes, usageTypes, usaget, unit, value, toBaseUnit = true) => { // eslint-disable-line max-len
  if (value === 'UNLIMITED') {
    return 'UNLIMITED';
  }
  const uom = getUom(propertyTypes, usageTypes, usaget);
  const u = (uom.find(propertyType => propertyType.get('name', '') === unit) || Immutable.Map()).get('unit', 1);
  return (value.toString().split(',').map(val => (toBaseUnit ? (val * u) : (val / u))).join());
};

const getItemConvertedRates = (propertyTypes, usageTypes, item, toBaseUnit, type) => {
  const convertedRates = item.get('rates', Immutable.Map()).withMutations((ratesWithMutations) => {
    ratesWithMutations.forEach((rates, usagetOrPlan) => {
      rates.forEach((rate, planOrUsaget) => {
        const usaget = (type === 'product' ? usagetOrPlan : planOrUsaget);
        const plan = (type === 'product' ? planOrUsaget : usagetOrPlan);
        rate.get('rate', Immutable.List()).forEach((rateStep, index) => {
          const rangeUnit = rateStep.getIn(['uom_display', 'range'], 'counter');
          const intervalUnit = rateStep.getIn(['uom_display', 'interval'], 'counter');
          const convertedFrom = getValueByUnit(propertyTypes, usageTypes, usaget, rangeUnit, rateStep.get('from'), toBaseUnit);
          const newFrom = isNumber(convertedFrom) ? parseFloat(convertedFrom) : convertedFrom;
          const to = rateStep.get('to');
          const convertedTo = (to === 'UNLIMITED' ? 'UNLIMITED' : getValueByUnit(propertyTypes, usageTypes, usaget, rangeUnit, to, toBaseUnit));
          const newTo = isNumber(convertedTo) ? parseFloat(convertedTo) : convertedTo;
          const convertedInterval = getValueByUnit(propertyTypes, usageTypes, usaget, intervalUnit, rateStep.get('interval'), toBaseUnit);
          const newInterval = isNumber(convertedInterval) ? parseFloat(convertedInterval) : convertedInterval;
          const ratePath = (type === 'product' ? [usaget, plan, 'rate', index] : [plan, usaget, 'rate', index]);
          ratesWithMutations.setIn([...ratePath, 'from'], newFrom);
          ratesWithMutations.setIn([...ratePath, 'to'], newTo);
          ratesWithMutations.setIn([...ratePath, 'interval'], newInterval);
        });
      });
    });
  });
  return !convertedRates.isEmpty()
    ? convertedRates
    : Immutable.Map();
};

export const getProductConvertedRates = (propertyTypes, usageTypes, item, toBaseUnit = true) => getItemConvertedRates(propertyTypes, usageTypes, item, toBaseUnit, 'product');

export const getPlanConvertedRates = (propertyTypes, usageTypes, item, toBaseUnit = true) => getItemConvertedRates(propertyTypes, usageTypes, item, toBaseUnit, 'plan');

export const getPlanConvertedPpThresholds = (propertyTypes, usageTypes, ppIncludes, item, toBaseUnit = true) => { // eslint-disable-line max-len
  const convertedPpThresholds = item.get('pp_threshold', Immutable.Map()).withMutations((ppThresholdsWithMutations) => {
    ppThresholdsWithMutations.forEach((value, ppId) => {
      const ppInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId)) || Immutable.Map();
      const unit = ppInclude.get('charging_by_usaget_unit', false);
      if (unit) {
        const usaget = ppInclude.get('charging_by_usaget', '');
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        ppThresholdsWithMutations.set(ppId, parseFloat(newValue));
      }
    });
  });
  return !convertedPpThresholds.isEmpty()
    ? convertedPpThresholds
    : Immutable.Map();
};

export const getPlanConvertedNotificationThresholds = (propertyTypes, usageTypes, ppIncludes, item, toBaseUnit = true) => { // eslint-disable-line max-len
  const convertedPpThresholds = item.get('notifications_threshold', Immutable.Map()).withMutations((notificationThresholdsWithMutations) => {
    notificationThresholdsWithMutations.forEach((notifications, ppId) => {
      const ppInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId)) || Immutable.Map();
      const unit = ppInclude.get('charging_by_usaget_unit', false);
      if (unit) {
        const usaget = ppInclude.get('charging_by_usaget', '');
        notifications.forEach((notification, index) => {
          const value = notification.get('value', '');
          const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit); // eslint-disable-line max-len
          notificationThresholdsWithMutations.setIn([ppId, index, 'value'], parseFloat(newValue));
        });
      }
    });
  });
  return !convertedPpThresholds.isEmpty()
    ? convertedPpThresholds
    : Immutable.Map();
};

export const getPlanConvertedPpIncludes = (propertyTypes, usageTypes, ppIncludes, item, toBaseUnit = true) => { // eslint-disable-line max-len
  const convertedIncludes = item.get('include', Immutable.Map()).withMutations((includesWithMutations) => {
    includesWithMutations.forEach((include, index) => {
      const ppId = include.get('pp_includes_external_id', '');
      const ppInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId)) || Immutable.Map();
      const unit = ppInclude.get('charging_by_usaget_unit', false);
      if (unit) {
        const usaget = ppInclude.get('charging_by_usaget', '');
        const value = include.get('usagev');
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        includesWithMutations.setIn([index, 'usagev'], parseFloat(newValue));
      }
    });
  });
  return !convertedIncludes.isEmpty()
    ? convertedIncludes
    : Immutable.Map();
};

export const getGroupUsaget = group => (group.get('cost', false) !== false
  ? 'cost'
  : group.get('usage_types', Immutable.Map()).keySeq().get(0, false));

export const getGroupUsageTypes = group => (group.get('cost', false) !== false
  ? 'cost'
  : Immutable.List(group.get('usage_types', Immutable.Map()).keySeq().toArray()));

export const isGroupMonetaryBased = group => getGroupUsaget(group) === 'cost';

export const getGroupValue = group => (isGroupMonetaryBased(group)
  ? group.get('cost', '')
  : group.get('value', ''));

export const getGroupUsages = group => (isGroupMonetaryBased(group)
  ? Immutable.List(['cost'])
  : Immutable.List(group.get('usage_types', Immutable.Map()).keySeq().toArray()));

export const getGroupUnit = group => (isGroupMonetaryBased(group)
  ? 'cost'
  : group.get('usage_types', Immutable.Map()).valueSeq().get(0, Immutable.Map()).get('unit', false));

export const getPlanConvertedIncludes = (propertyTypes, usageTypes, item, toBaseUnit = true) => {
  const convertedIncludes = item.get('include', Immutable.Map()).withMutations((includesWithMutations) => {
    includesWithMutations.get('groups', Immutable.Map()).forEach((include, group) => {
      const unit = getGroupUnit(include);
      const usaget = getGroupUsaget(include);
      if (unit && usaget && !isGroupMonetaryBased(include)) {
        const value = getGroupValue(include);
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        const newConvertedValue = (newValue === 'UNLIMITED') ? newValue : parseFloat(newValue);
        includesWithMutations.setIn(['groups', group, 'value'], newConvertedValue);
      }
    });
  });
  return !convertedIncludes.isEmpty()
    ? convertedIncludes
    : Immutable.Map();
};

export const convertServiceBalancePeriodToObject = (item) => {
  if (['', 'default'].includes(item.get('balance_period', 'default'))) {
    return { type: 'default', unit: '', value: '' };
  }
  const balancePeriodArray = item.get('balance_period', '').split(' ');
  const unit = balancePeriodArray[balancePeriodArray.length - 1];
  const value = Number(balancePeriodArray[balancePeriodArray.length - 2]);
  const type = 'custom_period';
  return { type, unit, value: (unit === 'days') ? value + 1 : value };
};

export const convertServiceBalancePeriodToString = (item) => {
  if (['', 'default'].includes(item.getIn(['balance_period', 'type'], 'default'))) {
    return 'default';
  }
  const unit = item.getIn(['balance_period', 'unit'], '');
  const value = item.getIn(['balance_period', 'value'], 1);
  const balancePeriod = (unit === 'days') ? `tomorrow +${value - 1} days` : `+${value} ${unit}`;
  return balancePeriod;
};

export const getAvailableFields = (settings, additionalFields = []) => {
  const fields = settings.get('fields', []).map(field => (Immutable.Map({ value: field, label: field }))).sortBy(field => field.get('value', ''));
  return fields.concat(Immutable.fromJS(additionalFields));
};

export const escapeRegExp = text =>
  text.toString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

export const createRateListNameByArgs = (query = Immutable.Map()) => query.reduce((acc, value, key) => `${acc}.${key}.${value}`, 'rates');

export const setFieldTitle = (field, entity) => (field.has('title')
    ? field
    : field.set('title', getFieldName(field.get('field_name', ''), getFieldNameType(entity), sentenceCase(field.get('field_name', '')))));

export const toImmutableList = (value) => {
  if ([undefined, null].includes(value)) {
    return Immutable.List();
  }
  if (Array.isArray(value)) {
    return Immutable.List([...value]);
  }
  if (Immutable.Iterable.isIterable(value)) {
    return value.toList();
  }
  return Immutable.List([value]);
};
