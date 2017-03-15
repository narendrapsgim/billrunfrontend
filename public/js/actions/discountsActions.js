import { startProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { fetchDiscountByIdQuery } from '../common/ApiQueries';
import {
  saveEntity,
  gotEntity,
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

export const getDiscount = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = fetchDiscountByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      dispatch(gotEntity('discount', item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving discount')));
};
