import { fetchDiscountByIdQuery } from '../common/ApiQueries';
import {
  saveEntity,
  getEntity,
  clearEntity,
  updateEntityField,
  deleteEntityField,
  setCloneEntity,
} from './entityActions';

export const setCloneDiscount = () => setCloneEntity('discount', 'discount');

export const clearDiscount = () => clearEntity('discount');

export const saveDiscount = (item, action) => saveEntity('discounts', item, action);

export const updateDiscount = (path, value) => updateEntityField('discount', path, value);

export const deleteDiscountValue = path => deleteEntityField('discount', path);

export const getDiscount = id => getEntity('discount', fetchDiscountByIdQuery(id));
