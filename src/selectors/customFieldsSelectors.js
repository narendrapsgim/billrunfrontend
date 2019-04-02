import { createSelector } from 'reselect';
import { List, Map } from 'immutable'; // eslint-disable-line no-unused-vars
import {
  accountFieldsSelector,
  subscriberFieldsSelector,
  productFieldsSelector,
  seriveceFieldsSelector,
  planFieldsSelector,
} from './settingsSelector';

export const customFieldsEntityFieldsSelector = createSelector(
  (state, props, entity) => entity,
  accountFieldsSelector,
  subscriberFieldsSelector,
  productFieldsSelector,
  seriveceFieldsSelector,
  planFieldsSelector,
  (entity, accountFields, subscriberFields, productFields, seriveceFields, planFields) => {
    switch (entity) {
      case 'customer': return accountFields;
      case 'subscription': return subscriberFields;
      case 'product': return productFields;
      case 'service': return seriveceFields;
      case 'plan': return planFields;
      default: return undefined;
    }
  },
);

export const isFieldPrintable = createSelector(
  field => field.get('field_name', ''),
  field => field.get('generated', false),
  (field, fieldsSettings) => fieldsSettings.get('hiddenFields', List()),
  (fieldName, isGenerated, hiddenFields) => (!isGenerated && !hiddenFields.includes(fieldName)),
);

export const isFieldSortable = createSelector(
  field => field.get('field_name', ''),
  (field, fieldsSettings) => fieldsSettings.get('unReorderFields', List()),
  (fieldName, unReorderFields) => (!unReorderFields.includes(fieldName)),
);

export const isFieldEditable = createSelector(
  field => field.get('field_name', ''),
  field => field.get('system', false),
  (field, fieldsSettings) => fieldsSettings.get('disabledFields', List()),
  (fieldName, isSystem, disabledFields) => (!isSystem && !disabledFields.includes(fieldName)),
);
