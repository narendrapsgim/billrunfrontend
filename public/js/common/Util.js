import Immutable from 'immutable';
import moment from 'moment';
import changeCase from 'change-case';
import fieldNamesConfig from '../config/fieldNames.json';
import reportConfig from '../config/report'
import systemItemsConfig from '../config/entities.json'
import mainMenu from '../config/mainMenu.json';
import eventsConfig from '../config/events.json';

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
    configCache = Immutable.fromJS(globalSetting)
  }
  if(!configCache.has(path[0])) {
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
      default: console.log(`Config caregory not exists ${path}`);
    }
  }
  return configCache.getIn(path, defaultValue);
};

export const titlize = str => changeCase.upperCaseFirst(str);

export const getFieldName = (field, category) =>
  getConfig(['fieldNames', category,field], getConfig(['fieldNames', field], field));

export const getFieldNameType = (type) => {
  switch (type) {
    case 'account':
    case 'customer':
      return 'account';
    case 'subscription':
    case 'subscriptions':
    case 'subscribers':
      return 'subscription';
    case 'lines':
    case 'usage':
      return 'lines';
    default:
      return '';
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

export const buildPageTitle = (mode, entityName, item = Immutable.Map()) => {
  switch (mode) {
    case 'clone':
    case 'create': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        return `Create New ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))}`;
      }
      return 'Create';
    }

    case 'loading':
    case 'closeandnew': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (entityName === 'customer') {
          return `Edit ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)} [${getCustomerId(item)}]`;
        } else if (entityName === 'subscription') {
          return `Edit ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)}`;
        }
        return `Edit ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'Edit';
    }

    case 'view': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (['subscription', 'customer'].includes(entityName)) {
          return `${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)}`;
        }
        return `${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
      }
      return 'View';
    }

    case 'update': {
      const entitySettings = getConfig(['systemItems', entityName]);
      if (entitySettings) {
        if (['subscription', 'customer'].includes(entityName)) {
          return `Update ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${getFirstName(item)} ${getLastName(item)}`;
        }
        return `Update ${changeCase.titleCase(entitySettings.get('itemName', entitySettings.get('itemType', '')))} - ${item.get(entitySettings.get('uniqueField', ''), '')}`;
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
  if (minDate) {
    if (item && getItemId(item, false)) {
      return moment.max(minDate, getItemDateValue(item, 'originalValue', getItemDateValue(item, 'from', moment(0))));
    }
    return minDate;
  }
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
    ? { value: option.get('value', ''), label: option.get('label', '') }
    : { value: option, label: changeCase.sentenceCase(option) }
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
    fieldConfig => fieldConfig.get('id') === oldField, null, Immutable.Map(),
  ).get('title', '');
  const newFieldLabel = oldField === newField ? oldFieldLabel : fieldsOptions.find(
    fieldConfig => fieldConfig.get('id') === newField, null, Immutable.Map(),
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

export const getUnitLabel = (propertyTypes, usageTypes, usaget, unit) => {
  const uom = getUom(propertyTypes, usageTypes, usaget);
  return (uom.find(propertyType => propertyType.get('name', '') === unit) || Immutable.Map()).get('label', '');
};

export const getValueByUnit = (propertyTypes, usageTypes, usaget, unit, value, toBaseUnit = true) => { // eslint-disable-line max-len
  const uom = getUom(propertyTypes, usageTypes, usaget);
  const u = (uom.find(propertyType => propertyType.get('name', '') === unit) || Immutable.Map()).get('unit', 1);
  return toBaseUnit ? (value * u) : (value / u);
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
          const to = rateStep.get('to');
          const convertedTo = (to === 'UNLIMITED' ? 'UNLIMITED' : getValueByUnit(propertyTypes, usageTypes, usaget, rangeUnit, to, toBaseUnit));
          const convertedInterval = getValueByUnit(propertyTypes, usageTypes, usaget, intervalUnit, rateStep.get('interval'), toBaseUnit);
          const ratePath = (type === 'product' ? [usaget, plan, 'rate', index] : [plan, usaget, 'rate', index]);
          ratesWithMutations.setIn([...ratePath, 'from'], convertedFrom);
          ratesWithMutations.setIn([...ratePath, 'to'], convertedTo);
          ratesWithMutations.setIn([...ratePath, 'interval'], convertedInterval);
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

export const getGroupUsaget = (group) => {
  const groupNotUsagetKeys = ['unit', 'account_shared', 'account_pool', 'rates'];
  const keys = group.keySeq().toArray().filter(key => !groupNotUsagetKeys.includes(key));
  if (keys.length) {
    return keys[0];
  }
  return false;
};

export const getPlanConvertedIncludes = (propertyTypes, usageTypes, item, toBaseUnit = true) => {
  const convertedIncludes = item.get('include', Immutable.Map()).withMutations((includesWithMutations) => {
    includesWithMutations.get('groups', Immutable.Map()).forEach((include, group) => {
      const unit = include.get('unit', false);
      const usaget = getGroupUsaget(include);
      if (unit && usaget) {
        const value = include.get(usaget);
        const newValue = getValueByUnit(propertyTypes, usageTypes, usaget, unit, value, toBaseUnit);
        includesWithMutations.setIn(['groups', group, usaget], parseFloat(newValue));
      }
    });
  });
  return !convertedIncludes.isEmpty()
    ? convertedIncludes
    : Immutable.Map();
};
