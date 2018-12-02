import { createSelector } from 'reselect';
import Immutable from 'immutable';
import {
  getConfig,
  getUnitLabel,
  getValueByUnit,
  parseConfigSelectOptions,
} from '../common/Util';


const getEventSettings = () => getConfig('events', Immutable.Map());

export const eventConditionsOperatorsSelector = createSelector(
  getEventSettings,
  (settings = Immutable.Map()) => settings.get('conditionsOperators', Immutable.List()),
);

export const eventConditionsOperatorsSelectOptionsSelector = createSelector(
  eventConditionsOperatorsSelector,
  (state, props) => props.eventType,
  (conditions = Immutable.Map(), eventType) => conditions
    .filter(cond => cond.get('include', Immutable.List()).includes(eventType))
    .map(parseConfigSelectOptions)
    .toArray(),
);
