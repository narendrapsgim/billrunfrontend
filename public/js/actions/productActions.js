import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { fetchProductByIdQuery } from '../common/ApiQueries';
import { showSuccess } from './alertsActions';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

export const PRODUCT_GOT = 'PRODUCT_GOT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const PRODUCT_CLEAR = 'PRODUCT_CLEAR';
export const PRODUCT_ADD_RATE = 'PRODUCT_ADD_RATE';
export const PRODUCT_REMOVE_RATE = 'PRODUCT_REMOVE_RATE';
export const PRODUCT_UPDATE_FIELD_VALUE = 'PRODUCT_UPDATE_FIELD_VALUE';
export const PRODUCT_UPDATE_USAGET_VALUE = 'PRODUCT_UPDATE_USAGET_VALUE';
export const PRODUCT_UPDATE_TO_VALUE = 'PRODUCT_UPDATE_TO_VALUE';

export const buildSaveProductQuery = (product, action) => {
  const type = action !== 'new' ? 'close_and_new' : action;
  const from = moment();
  const to = moment().add(100, 'years');

  const productToSave = product
    .set('from', from)
    .set('to', to);

  const formData = new FormData();
  if (action !== 'new') {
    formData.append('id', productToSave.getIn(['_id', '$id']));
  }
  formData.append('coll', 'rates');
  formData.append('type', type);
  formData.append('data', JSON.stringify(productToSave));

  return {
    api: 'save',
    name: product.get('key'),
    options: {
      method: 'POST',
      body: formData,
    },
  };
};

/* Internal function */
const saveProductToDB = (product, action, callback) => (dispatch) => {
  const query = buildSaveProductQuery(product, action);
  dispatch(startProgressIndicator());
  return apiBillRun(query)
    .then((success) => {
      dispatch(showSuccess('Product saved successfully'));
      dispatch(finishProgressIndicator());
      callback(success);
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error)));
};

const gotProduct = product => ({
  type: PRODUCT_GOT,
  product,
});

const fetchProduct = id => (dispatch) => {
  dispatch(startProgressIndicator());
  return apiBillRun(fetchProductByIdQuery(id))
    .then((resp) => {
      const product = resp.data[0].data.details[0];
      dispatch(gotProduct(product));
      dispatch(finishProgressIndicator());
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error)));
};

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

export const getProduct = productId => dispatch => dispatch(fetchProduct(productId));

export const saveProduct = (product, action, callback = () => {}) => dispatch =>
  dispatch(saveProductToDB(product, action, callback));
