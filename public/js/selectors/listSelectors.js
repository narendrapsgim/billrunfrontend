import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { getCycleName } from '../components/Cycle/CycleUtil';


const getCyclesOptions = state => state.list.get('cycles_list', null);

const selectCyclesOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: getCycleName(option),
    value: option.get('billrun_key', ''),
  }));
};

const getProductsOptions = state => state.list.get('all_rates', null);

const selectProductsOptions = (options) => {
  if (options === null) {
    return undefined;
  }
  return options.map(option => Immutable.Map({
    label: `${option.get('description', '')} (${option.get('key', '')})`,
    value: option.get('key', ''),
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

export const productsOptionsSelector = createSelector(
  getProductsOptions,
  selectProductsOptions,
);

export const plansOptionsSelector = createSelector(
  getPlansOptions,
  selectPlansOptions,
);

export const groupsOptionsSelector = createSelector(
  getGroupsOptions,
  selectGroupsOptions,
);

export const groupsDataSelector = createSelector(
  getGroupsOptions,
  selectGroupsData,
);

export const bucketsNamesSelector = createSelector(
  getBucketsOptions,
  selectBucketsNames,
);

export const bucketsExternalIdsSelector = createSelector(
  getBucketsOptions,
  selectBucketsExternalIds,
);
