import { createSelector } from 'reselect';
import { compose } from 'redux';
import Immutable from 'immutable';
import {
  isLinkerField,
  isUpdaterField,
  setFieldTitle,  
} from '@/common/Util';
import {
  itemSelector,
  selectorFieldsByEntity,
} from './entitySelector';
import {
  productFieldsSelector,
  accountFieldsSelector,
  subscriberFieldsSelector,
  formatFieldOptions,
  addDefaultFieldOptions,
  importSelector,
} from './settingsSelector';

const selectSubscriberImportFields = (fields, accountfields) => {
  if (fields) {
    const importLinkers = accountfields.filter(isLinkerField);
    if (importLinkers.size > 0) {
      return fields.withMutations((fieldsWithMutations) => {
        importLinkers.forEach((importLinker) => {
          fieldsWithMutations.push(Immutable.Map({
            linker: true,
            field_name: importLinker.get('field_name', 'linker'),
            title: importLinker.get('title', importLinker.get('field_name', 'linker')),
          }));
        });
      });
    }
    return fields.push(Immutable.Map({
      linker: true,
      field_name: 'account_import_id',
      title: 'Customer Import ID',
    }));
  }
  return fields;
};

const selectProductImportFields = (fields) => {
  const hiddenFields = ['to', 'rates'];
  const uniqueFields = ['key'];
  const mandatory = ['tariff_category'];
  return Immutable.List().withMutations((fieldsWithMutations) => {
    fields.forEach((field) => {
      // Update field
      const productField = field.withMutations((fieldWithMutations) => {
        const isUniqueField = uniqueFields.includes(fieldWithMutations.get('field_name', ''));
        if (isUniqueField) {
          fieldWithMutations.set('unique', true);
        }
        const isMandatoryField = mandatory.includes(fieldWithMutations.get('field_name', ''));
        if (isMandatoryField) {
          fieldWithMutations.set('mandatory', true);
        }
        if (isUpdaterField(fieldWithMutations)) {
          fieldWithMutations.set('updater', true);
        }
      });
      // push to list
      const editable = productField.get('editable', true);
      const isHiddenField = hiddenFields.includes(productField.get('field_name', ''));
      if (editable && !isHiddenField) {
        fieldsWithMutations.push(productField);
      } else {
        fieldsWithMutations.push(productField.set('show', false));
      }
      if (productField.get('field_name', '') === 'rates') {
        const fieldPriceFrom = Immutable.Map({ field_name: 'price_from' });
        fieldsWithMutations.push(setFieldTitle(fieldPriceFrom, 'product'));

        const fieldPriceTo = Immutable.Map({ field_name: 'price_to' });
        fieldsWithMutations.push(setFieldTitle(fieldPriceTo, 'product'));

        const fieldPriceInterval = Immutable.Map({ field_name: 'price_interval' });
        fieldsWithMutations.push(setFieldTitle(fieldPriceInterval, 'product'));

        const fieldPriceValue = Immutable.Map({ field_name: 'price_value' });
        fieldsWithMutations.push(setFieldTitle(fieldPriceValue, 'product'));

        const fieldPricePlan = Immutable.Map({ field_name: 'price_plan' });
        fieldsWithMutations.push(setFieldTitle(fieldPricePlan, 'product'));

        const helpPercentage = 'Field will effect only if \'Plan Price Override\' value is different from BASE';
        const fieldPricePercentage = Immutable.Map({ field_name: 'rates.percentage', help: helpPercentage });
        fieldsWithMutations.push(setFieldTitle(fieldPricePercentage, 'import'));

        const fieldVatable = Immutable.Map({ field_name: 'vatable' });
        fieldsWithMutations.push(setFieldTitle(fieldVatable, 'product'));
      }
    });
    const fieldPricePlan = Immutable.Map({
      field_name: 'usage_type',
      mandatory: true,
    });
    fieldsWithMutations.push(fieldPricePlan);
    const fieldEffectiveDate = Immutable.Map({
      field_name: 'effective_date',
      mandatory: true,
    });
    fieldsWithMutations.push(fieldEffectiveDate);
  });
};

const selectAccountImportFields = (fields) => {
  if (fields) {
    const existImportLinker = fields.findIndex(isLinkerField);
    return (existImportLinker !== -1)
      ? fields
      : fields.push(Immutable.Map({
        unique: true,
        generated: false,
        mandatory: true,
        field_name: 'account_import_id',
        title: 'Customer Import ID (for subscriber import)',
      }));
  }
  return fields;
};

export const accountImportFieldsSelector = createSelector(
  accountFieldsSelector,
  selectAccountImportFields,
);

export const subscriberImportFieldsSelector = createSelector(
  subscriberFieldsSelector,
  accountImportFieldsSelector,
  selectSubscriberImportFields,
);

export const productImportFieldsSelector = createSelector(
  productFieldsSelector,
  selectProductImportFields,
);

export const importMapperSelector = createSelector(
  importSelector,
  // if mapping is empty it will transfet to object
  (importConfig = Immutable.Map()) => importConfig.get('mapping', Immutable.List()).toList()
);

export const importFieldsOptionsSelector = createSelector(
  itemSelector,
  accountImportFieldsSelector,
  subscriberImportFieldsSelector,
  productImportFieldsSelector,
  (item, accountFields, subscriberImportFields, productImportFields) => compose(
    composedFields => (composedFields ? composedFields.toArray() : undefined),
    fieldsByEntity => addDefaultFieldOptions(fieldsByEntity, item),
    fieldsByEntity => formatFieldOptions(fieldsByEntity, item),
    selectorFieldsByEntity,
  )(item, accountFields, subscriberImportFields, productImportFields),
);
