import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import {
  getFieldName,
  getFieldNameType,
  getConfig,
  sortFieldOption,
} from '@/common/Util';
import {
  subscriberFieldsWithPlaySelector,
  accountFieldsSelector,
  isPlaysEnabledSelector,
} from './settingsSelector';


const getDiscountsConditionsConfigFields = (state, props, type) => getConfig(['discount', 'fields', type], Immutable.List());

const getType = (state, props, type) => type;

const formatReportFields = (fields) => {
  if (!fields) {
    return Immutable.List();
  }
  return fields.map(field => Immutable.Map({
    id: field.get('field_name', ''),
    title: field.get('title', ''),
    type: field.get('type', 'string'),
    inputConfig: field.get('inputConfig', null),
  }));
};

const mergeBillRunAndConfigFields = (
  billrunConfigFields,
  discountsConfigFields,
  type,
  isPlayEnabled = false,
) => {
  const entityFields = formatReportFields(billrunConfigFields);
  const defaultField = Immutable.Map({});
  return Immutable.List().withMutations((fieldsWithMutations) => {
    // Push all fields from Billrun config
    entityFields.forEach((entityField) => {
      fieldsWithMutations.push(entityField);
    });
    // Push report config fields or override if exist
    discountsConfigFields.forEach((predefinedFiled) => {
      const index = fieldsWithMutations.findIndex(field => field.get('id', '') === predefinedFiled.get('id', ''));
      if (index === -1) {
        fieldsWithMutations.push(defaultField.merge(predefinedFiled));
      } else {
        fieldsWithMutations.update(index, Immutable.Map(), field => field.merge(predefinedFiled));
      }
    });
    // Set title if not exist
    fieldsWithMutations.forEach((field, index) => {
      if (!field.has('title')) {
        const title = getFieldName(field.get('id', ''), getFieldNameType(type), sentenceCase(field.get('id', '')));
        fieldsWithMutations.setIn([index, 'title'], title);
      }
    });
  })
  .filter(field => (
    field.get('id') !== 'play' || (field.get('id') === 'play' && isPlayEnabled)
  ))
  .sort(sortFieldOption);
};

export const discountSubscriberFieldsSelector = createSelector(
  subscriberFieldsWithPlaySelector,
  getDiscountsConditionsConfigFields,
  getType,
  isPlaysEnabledSelector,
  mergeBillRunAndConfigFields,
);

export const discountAccountFieldsSelector = createSelector(
  accountFieldsSelector,
  getDiscountsConditionsConfigFields,
  getType,
  isPlaysEnabledSelector,
  mergeBillRunAndConfigFields,
);

export const discountSubscriberServicesFieldsSelector = createSelector(
  () => Immutable.List(),
  getDiscountsConditionsConfigFields,
  getType,
  () => true,
  mergeBillRunAndConfigFields,
);
