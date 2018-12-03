import { createSelector } from 'reselect';
// import { titleCase, sentenceCase, upperCaseFirst } from 'change-case';
import Immutable from 'immutable';
import {
  getConfig,
  // getFieldName,
  // getFieldNameType,
  // getUnitLabel,
  // getValueByUnit,
  parseConfigSelectOptions,
  sortFieldOption,
  setFieldTitle,
} from '../common/Util';
import {
  // subscriberFieldsSelector,
  // inputProssesorfilteredFieldsSelector,
  // accountFieldsSelector,
  linesFieldsSelector,
  // getLinesFields
  // rateCategoriesSelector,
  // usageTypeSelector,
  // fileTypeSelector,
  // eventCodeSelector,
} from './settingsSelector';


/* Helpers */

const formatEventConditionsFilter = (evetntConfigFields = Immutable.List(), billrunFields = Immutable.List()) =>
  Immutable.List().withMutations((optionsWithMutations) => {
    // Set fields from billrun settings
    billrunFields.forEach((billrunField) => {
      billrunField.withMutations((billrunFieldWithMutations) => {
        billrunFieldWithMutations.set('title', setFieldTitle(billrunField).get('title', ''));
        billrunFieldWithMutations.set('type', 'string');
        billrunFieldWithMutations.set('id', billrunField.get('field_name'));
        optionsWithMutations.push(billrunFieldWithMutations);
      });
    });
    // set fields from event config
    evetntConfigFields.forEach((evetntConfigField) => {
      optionsWithMutations.push(setFieldTitle(evetntConfigField, null, 'id'));
    });
  });

/* Getters */
const getEventConfig = () => getConfig('events', Immutable.Map());

export const eventConditionsOperatorsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('conditionsOperators', Immutable.List()),
);
export const eventConditionsOperatorsSelectOptionsSelector = createSelector(
  eventConditionsOperatorsSelector,
  (state, props) => props.eventType,
  (operators = Immutable.Map(), eventType) => operators
    .filter(operator => operator.get('include', Immutable.List()).includes(eventType))
    .map(parseConfigSelectOptions)
    .toArray(),
);


export const eventConditionsConfigFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('conditionsFields', Immutable.List()),
);
export const foreignLinesFieldsSelector = createSelector(
  linesFieldsSelector,
  (lineFields = Immutable.List()) => lineFields.filter(lineField => lineField.has('foreign')),
);
export const eventConditionsFilterOptionsSelector = createSelector(
  eventConditionsConfigFieldsSelector,
  foreignLinesFieldsSelector,
  formatEventConditionsFilter,
);
export const eventConditionsFieldsSelectOptionsSelector = createSelector(
  eventConditionsFilterOptionsSelector,
  (conditionsFilter = Immutable.List()) => conditionsFilter
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventThresholdOperatorsSelector = createSelector(
  getEventConfig,
  (state, props) => props.eventType,
  (config = Immutable.Map(), eventType) => config
    .get('thresholdOperators', Immutable.List())
    .filter(operator => operator.get('include', Immutable.List()).includes(eventType)),
);
export const eventThresholdOperatorsSelectOptionsSelector = createSelector(
  eventThresholdOperatorsSelector,
  (operators = Immutable.Map()) => operators
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventTresholdFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('thresholdFields', Immutable.List()),
);
export const eventThresholdFieldsSelectOptionsSelector = createSelector(
  eventTresholdFieldsSelector,
  (operators = Immutable.Map()) => operators
    .map(field => setFieldTitle(field, null, 'id'))
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);
