import Immutable from 'immutable';
import { fetchDiscountByIdQuery } from '../common/ApiQueries';
import {
  saveEntity,
  getEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  setCloneEntity,
} from './entityActions';
import {
  discountFieldsSelector,
} from '@/selectors/settingsSelector';

export const setCloneDiscount = () => setCloneEntity('discount', 'discount');

export const clearDiscount = () => clearEntity('discount');

export const saveDiscount = (item, action) => saveEntity('discounts', item, action);

export const updateDiscount = (path, value) => updateEntityField('discount', path, value);

export const deleteDiscountValue = path => deleteEntityField('discount', path);

export const getDiscount = id => getEntity('discount', fetchDiscountByIdQuery(id));


export const validateEntity = (entity, type = 'save') => (dispatch, getState) => {
  let fields = discountFieldsSelector(getState());
  // To field is not mandatory and will be set by BE
  if (type === 'save') {
    fields = fields.filter(field => field.get('field_name', '') !== 'to')
  }
  return Immutable.Map().withMutations((errorsWithMutations) => {
    fields.forEach((field) => {
      const fieldName = field.get('field_name', '');
      const fieldValue = entity.getIn(fieldName.split('.'));
      const hasError = validateField(field, fieldValue);
      if (hasError !== false) {
        errorsWithMutations.set(fieldName, hasError);
      }
    });
  });
};

export const validateField = (fieldConfig, value) => {
  // validate mandaroty
  if (fieldConfig.get('mandatory', false)) {
    switch (fieldConfig.get('type', false)) {
      default: {
        if (['', null, undefined].includes(value)) {
          return `Field ${fieldConfig.get('title', fieldConfig.get('field_name', ''))} is required.`;
        }
      }
    }
  }
  return false;
}
