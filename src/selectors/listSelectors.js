import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import { getCycleName } from '@/components/Cycle/CycleUtil';
import { getConfig } from '@/common/Util';
import {
  availablePlaysLabelsSelector,
} from './settingsSelector';


const getEventRates = state => state.list.get('event_products', null);

const getCyclesOptions = state => state.list.get('cycles_list', null);

const getUserNamesOptions = state => state.list.get('autocompleteUser', null);

const getAuditEntityTypesOptions = state => state.list.get('autocompleteAuditTrailEntityTypes', null);

const getAuditLogs = state => state.list.get('log');

const selectCyclesOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: getCycleName(option),
    value: option.get('billrun_key', ''),
  }));
};

const getServicesOptions = state => state.list.get('available_services', null);

const selectServicesOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: `${option.get('description', '')} (${option.get('name', '')})`,
    value: option.get('name', ''),
  }));
};

const getProductsOptions = state => state.list.get('all_rates', null);

const getOptionsByListName = (state, props, listName = '') => state.list.get(listName, null);

const selectProductsOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: `${option.get('description', '')} (${option.get('key', '')})`,
    value: option.get('key', ''),
  }));
};

const selectUserNamesOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(user => user.get('username'));
};

const selectEntityTypesOptions = (options) => {
  if (options === null) {
    return undefined;
  }

  return options.map(type => ({
    key: type.get('name', ''),
    val: sentenceCase(type.get('name', '')),
  }));
};

const getPlansOptions = state => state.list.get('available_plans', null);

const selectPlansOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: `${option.get('description', '')} (${option.get('name', '')})`,
    value: option.get('name', ''),
  }));
};

const selectPlayTypeOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map((label, value) => Immutable.Map({ label, value }));
};

const getGroupsOptions = state => state.list.get('available_groups', null);

const selectGroupsOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return Immutable.Set().withMutations((optionsWithMutations) => {
    options.forEach((option) => {
      option.getIn(['include', 'groups'], Immutable.Map())
        .keySeq()
        .forEach((key) => {
          optionsWithMutations.add(key);
        });
    });
  }).toList();
};

const selectGroupsData = (options) => {
  if (options === null) {
    return undefined;
  }
  return Immutable.Map().withMutations((groupsWithMutations) => {
    options.forEach((option) => {
      option.getIn(['include', 'groups'], Immutable.Map())
        .forEach((groupData, groupName) => {
          groupsWithMutations.set(groupName, groupData);
        });
    });
  });
};

const getBucketsOptions = state => state.list.get('pp_includes', null);

const selectBucketsNames = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: option.get('name', ''),
    value: option.get('name', ''),
  }));
};

const selectBucketsExternalIds = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: option.get('external_id', ''),
    value: option.get('external_id', ''),
  }));
};

export const cyclesOptionsSelector = createSelector(
  getCyclesOptions,
  selectCyclesOptions,
);

export const eventRatesSelector = createSelector(
  getEventRates,
  rates => (rates === null ? undefined : rates),
);

export const productsOptionsSelector = createSelector(
  getProductsOptions,
  selectProductsOptions,
);

export const listByNameSelector = createSelector(
  getOptionsByListName,
  selectProductsOptions,
);

export const servicesOptionsSelector = createSelector(
  getServicesOptions,
  selectServicesOptions,
);

export const plansOptionsSelector = createSelector(
  getPlansOptions,
  selectPlansOptions,
);

export const getPlayTypeOptions = createSelector(
  availablePlaysLabelsSelector,
  selectPlayTypeOptions,
);

export const groupsOptionsSelector = createSelector(
  getGroupsOptions,
  selectGroupsOptions,
);

export const bucketsNamesSelector = createSelector(
  getBucketsOptions,
  selectBucketsNames,
);

export const bucketsExternalIdsSelector = createSelector(
  getBucketsOptions,
  selectBucketsExternalIds,
);

export const auditlogSelector = createSelector(
  getAuditLogs,
  log => log
);

export const userNamesSelector = createSelector(
  getUserNamesOptions,
  selectUserNamesOptions,
);

export const auditEntityTypesSelector = createSelector(
  getAuditEntityTypesOptions,
  selectEntityTypesOptions,
);

export const groupsDataSelector = createSelector(
  getGroupsOptions,
  selectGroupsData,
);

export const calcNameSelector = createSelector(
  () => getConfig('queue_calculators', []),
  (calculators) => {
    const values = [false, ...calculators];
    return calculators
      .map((calculator, i) => Immutable.Map({
        label: sentenceCase(calculator),
        value: values[i],
      }));
  },
);
