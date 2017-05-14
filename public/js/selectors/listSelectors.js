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
