import Immutable from 'immutable';
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

export const saveDiscount = (item, action) => (dispatch) => {
  if (item.get('discount_type', '') === 'percentage') {
    // convert discount value to percentage
    const itemPercentage = item.withMutations((itemWithMutations) => {
      itemWithMutations
        .get('discount_subject', Immutable.Map())
        .forEach((subject, subjectName) => {
          subject.forEach((value, name) => {
            if (value && !isNaN(value)) {
              itemWithMutations.setIn(['discount_subject', subjectName, name], value / 100);
            }
          });
        });
    });
    return dispatch(saveEntity('discounts', itemPercentage, action));
  }
  return dispatch(saveEntity('discounts', item, action));
};

export const updateDiscount = (path, value) => updateEntityField('discount', path, value);

export const deleteDiscountValue = path => deleteEntityField('discount', path);

export const getDiscount = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = fetchDiscountByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      if (item.discount_type === 'percentage') {
        // convert discount percentage value to display value
        if (item.discount_subject) {
          Object.keys(item.discount_subject).forEach((type) => {
            Object.keys(item.discount_subject[type]).forEach((serviceName) => {
              if (!isNaN(item.discount_subject[type][serviceName])) {
                const num = Number(item.discount_subject[type][serviceName]);
                item.discount_subject[type][serviceName] = parseFloat((num * 100).toFixed(2));
              }
            });
          });
        }
      }
      dispatch(gotEntity('discount', item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving discount')));
};
