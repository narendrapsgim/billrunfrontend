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
const getSubscriptionsOptions = state => state.list.get('available_subscriptions', null);

const selectSubscriptionsOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => {
    let name = '';
    name += option.get('firstname', '').trim() !== '' ? option.get('firstname', '').trim() : '';
    name += option.get('lastname', '').trim() !== '' ? ` ${option.get('lastname', '').trim()}` : '';
    return Immutable.Map({
      title: name.trim(),
      sid: option.get('sid', ''),
      aid: option.get('aid', ''),
    })
  });
}

const getAccountsOptions = state => state.list.get('available_accounts', null);

const selectAccountsOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => {
    let name = '';
    name += option.get('firstname', '').trim() !== '' ? option.get('firstname', '').trim() : '';
    name += option.get('lastname', '').trim() !== '' ? ` ${option.get('lastname', '').trim()}` : '';
    return Immutable.Map({
      title: name.trim(),
      aid: option.get('aid', ''),
    })
  });
}

const getServicesOptions = state => state.list.get('available_services', null);

const getTaxesOptions = state => state.list.get('available_taxRates', null);

const getProductsOptions = state => state.list.get('all_rates', null);

const getOptionsByListName = (state, props, listName = '') => state.list.get(listName, null);

const getEntitiesOptions = (state, props, entities = []) =>
  Immutable.Map().withMutations((optionsWithMutations) => {
    entities.forEach((entity) => {
      const entitiesName = getConfig(['systemItems', entity, 'itemsType'], '');
      optionsWithMutations.set(entity, state.list.get(`available_${entitiesName}`, Immutable.List()));
  });
});

const formatSelectOptions = (options, key) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: `${option.get('description', '')} (${option.get(key, '')})`,
    value: option.get(key, ''),
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

export const entitiesOptionsSelector = createSelector(
  getEntitiesOptions,
  options => options,
);

export const eventRatesSelector = createSelector(
  getEventRates,
  rates => (rates === null ? undefined : rates),
);

export const productsOptionsSelector = createSelector(
  getProductsOptions,
  () => 'key',
  formatSelectOptions,
);

export const listByNameSelector = createSelector(
  getOptionsByListName,
  () => 'key',
  formatSelectOptions,
);

export const subscriptionsOptionsSelector = createSelector(
  getSubscriptionsOptions,
  selectSubscriptionsOptions,
);

export const accountsOptionsSelector = createSelector(
  getAccountsOptions,
  selectAccountsOptions,
);

export const servicesOptionsSelector = createSelector(
  getServicesOptions,
  () => 'name',
  formatSelectOptions,
);

export const taxesOptionsSelector = createSelector(
  getTaxesOptions,
  () => 'key',
  formatSelectOptions,
);

export const plansOptionsSelector = createSelector(
  getPlansOptions,
  () => 'name',
  formatSelectOptions,
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
