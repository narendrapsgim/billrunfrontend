import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { fetchProductByIdQuery } from '../common/ApiQueries';
import { startProgressIndicator } from './progressIndicatorActions';
import { saveEntity } from './entityActions';


export const PRODUCT_GOT = 'PRODUCT_GOT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const PRODUCT_CLEAR = 'PRODUCT_CLEAR';
export const PRODUCT_CLONE_RESET = 'PRODUCT_CLONE_RESET';
export const PRODUCT_ADD_RATE = 'PRODUCT_ADD_RATE';
export const PRODUCT_REMOVE_RATE = 'PRODUCT_REMOVE_RATE';
export const PRODUCT_UPDATE_FIELD_VALUE = 'PRODUCT_UPDATE_FIELD_VALUE';
export const PRODUCT_UPDATE_USAGET_VALUE = 'PRODUCT_UPDATE_USAGET_VALUE';
export const PRODUCT_UPDATE_TO_VALUE = 'PRODUCT_UPDATE_TO_VALUE';


const gotItem = product => ({
  type: PRODUCT_GOT,
  product,
});

export const clearProduct = () => ({
  type: PRODUCT_CLEAR,
});

export const onFieldUpdate = (path, value) => ({
  type: PRODUCT_UPDATE_FIELD_VALUE,
  path,
  value,
});

export const onToUpdate = (path, index, value) => ({
  type: PRODUCT_UPDATE_TO_VALUE,
  path,
  index,
  value,
});

export const onUsagetUpdate = (path, oldUsaget, newUsaget) => ({
  type: PRODUCT_UPDATE_USAGET_VALUE,
  path,
  oldUsaget,
  newUsaget,
});

export const onRateAdd = path => ({
  type: PRODUCT_ADD_RATE,
  path,
});

export const onRateRemove = (path, index) => ({
  type: PRODUCT_REMOVE_RATE,
  path,
  index,
});

export const setCloneProduct = () => ({
  type: PRODUCT_CLONE_RESET,
});

export const saveProduct = (product, action) => saveEntity('rates', product, action);

export const getProduct = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = fetchProductByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      dispatch(gotItem(item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving product')));
};
