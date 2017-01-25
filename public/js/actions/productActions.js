export const PRODUCT_GOT = 'PRODUCT_GOT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const PRODUCT_CLEAR = 'PRODUCT_CLEAR';
export const PRODUCT_ADD_RATE = 'PRODUCT_ADD_RATE';
export const PRODUCT_REMOVE_RATE = 'PRODUCT_REMOVE_RATE';
export const PRODUCT_UPDATE_FIELD_VALUE = 'PRODUCT_UPDATE_FIELD_VALUE';
export const PRODUCT_UPDATE_USAGET_VALUE = 'PRODUCT_UPDATE_USAGET_VALUE';
export const PRODUCT_UPDATE_TO_VALUE = 'PRODUCT_UPDATE_TO_VALUE';

import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { showSuccess, showDanger } from './alertsActions';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';


export function clearProduct() {
  return {
    type: PRODUCT_CLEAR
  };
}

export function onFieldUpdate(path, value) {
  return {
    type: PRODUCT_UPDATE_FIELD_VALUE,
    path,
    value
  };
}

export function onToUpdate(path, index, value) {
  return {
    type: PRODUCT_UPDATE_TO_VALUE,
    path,
    index,
    value
  };
}

export function onUsagetUpdate(path, oldUsaget, newUsaget) {
  return {
    type: PRODUCT_UPDATE_USAGET_VALUE,
    path,
    oldUsaget,
    newUsaget
  };
}

export function onRateAdd(path) {
  return {
    type: PRODUCT_ADD_RATE,
    path
  };
}

export function onRateRemove(path, index) {
  return {
    type: PRODUCT_REMOVE_RATE,
    path,
    index
  };
}

export function getProduct(productId) {
  return dispatch => {
    return dispatch(fetchProduct(productId));
  };
}

export function saveProduct(product, action, callback = () => {}) {
  return dispatch => {
    return dispatch(saveProductToDB(product, action, callback));
  };
}

export function buildSaveProductQuery(product, action){
    const type = action !== 'new' ? 'close_and_new' : action;
    const from = moment(); //.format(globalSetting.apiDateTimeFormat)
    const to = moment().add(100, 'years'); //.format(globalSetting.apiDateTimeFormat)

    product = product.set('from', from).set('to', to);
    product = product.delete('uiflags');

    let formData = new FormData();
    if (action !== 'new'){
      formData.append('id', product.getIn(['_id','$id']));
    }
    formData.append('coll', 'rates');
    formData.append('type', type);
    formData.append('data', JSON.stringify(product));

    console.log('Save product : ', product.toJS());

    return {
      api: 'save',
      name: product.get('key'),
      options: {
        method: 'POST',
        body: formData
      }
    };
}

/* Internal function */
function saveProductToDB(product, action, callback) {

  const query = buildSaveProductQuery(product, action);

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(showSuccess('Product saved successfully'));
        dispatch(finishProgressIndicator());
        callback(success);
      }
    ).catch(
      error => { dispatch(apiBillRunErrorHandler(error)); }
    );
  };
}

function gotProduct(product) {
  return {
    type: PRODUCT_GOT,
    product
  };
}

function fetchProduct(id) {
  const query = {
    api: 'find',
    params: [
      { collection: 'rates' },
      { size: '1' },
      { page: '0' },
      { query: JSON.stringify(
        {'_id' :  {'$in': [id]}}
      )},
    ]
  };

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      resp => {
        let p = _.values(resp.data[0].data.details)[0];
        dispatch(gotProduct(p));
        dispatch(finishProgressIndicator());
      }
    ).catch(error => {
      if (error.data){
        dispatch(showDanger(error.data.message));
      }
      dispatch(finishProgressIndicator());
    });
  };
}
