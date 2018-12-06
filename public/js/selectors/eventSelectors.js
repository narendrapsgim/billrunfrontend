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
  onlyLineForeignFields,
  foreignFieldWithoutDates,
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
  (state, props) => props.eventType,
  (config = Immutable.Map(), eventType) => config.getIn(['operators', eventType, 'conditions'], Immutable.List()),
);
export const eventConditionsOperatorsSelectOptionsSelector = createSelector(
  eventConditionsOperatorsSelector,
  (operators = Immutable.Map()) => operators
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventConditionsConfigFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('conditionsFields', Immutable.List()),
);
export const foreignLinesFieldsSelector = createSelector(
  linesFieldsSelector,
  (lineFields = Immutable.List()) => lineFields
    .filter(onlyLineForeignFields)
    .filter(foreignFieldWithoutDates),
);
export const eventConditionsFilterOptionsSelector = createSelector(
  eventConditionsConfigFieldsSelector,
  foreignLinesFieldsSelector,
  formatEventConditionsFilter,
);
export const eventConditionsFieldsSelectOptionsSelector = createSelector(
  eventConditionsFilterOptionsSelector,
  (state, props) => props.condition.get('field'),
  (state, props) => props.usedFields,
  (conditionsFilter = Immutable.List(), conditionIndexField, usedFields) => conditionsFilter
    .filter(fieldOption => (fieldOption.get('id', '') === conditionIndexField
      ? true // parsing current selected option for index
      : !usedFields.includes(fieldOption.get('id', ''))
    ))
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventThresholdOperatorsSelector = createSelector(
  getEventConfig,
  (state, props) => props.eventType,
  (config = Immutable.Map(), eventType) => config.getIn(['operators', eventType, 'threshold'], Immutable.List()),
);
export const eventThresholdOperatorsSelectOptionsSelector = createSelector(
  eventThresholdOperatorsSelector,
  (operators = Immutable.Map()) => operators
    .map(parseConfigSelectOptions)
    .toArray(),
);

export const eventTresholdFieldsSelector = createSelector(
  getEventConfig,
  (config = Immutable.Map()) => config.get('thresholdFields', Immutable.List())
    .map(field => setFieldTitle(field, null, 'id')),
);
export const eventThresholdFieldsSelectOptionsSelector = createSelector(
  eventTresholdFieldsSelector,
  (operators = Immutable.Map()) => operators
    .sort(sortFieldOption)
    .map(parseConfigSelectOptions)
    .toArray(),
);
