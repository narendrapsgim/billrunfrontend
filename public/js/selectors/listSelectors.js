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

export const cyclesOptions = createSelector(
  getCyclesOptions,
  selectCyclesOptions,
);
