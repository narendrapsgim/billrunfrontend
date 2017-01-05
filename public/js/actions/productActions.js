export const GOT_PRODUCT = 'GOT_PRODUCT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT';
export const ADD_PRODUCT_RATE = 'ADD_PRODUCT_RATE';
export const REMOVE_PRODUCT_RATE = 'REMOVE_PRODUCT_RATE';
export const UPDATE_PRODUCT_FIELD_VALUE = 'UPDATE_PRODUCT_FIELD_VALUE';
export const UPDATE_PRODUCT_USAGET_VALUE = 'UPDATE_PRODUCT_USAGET_VALUE';
export const UPDATE_PRODUCT_TO_VALUE = 'UPDATE_PRODUCT_TO_VALUE';

import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { showSuccess, showDanger } from './alertsActions';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';


export function clearProduct() {
  return {
    type: CLEAR_PRODUCT
  };
}

export function onFieldUpdate(path, value) {
  return {
    type: UPDATE_PRODUCT_FIELD_VALUE,
    path,
    value
  };
}

export function onToUpdate(path, index, value) {
  return {
    type: UPDATE_PRODUCT_TO_VALUE,
    path,
    index,
    value
  };
}

export function onUsagetUpdate(path, oldUsaget, newUsaget) {
  return {
    type: UPDATE_PRODUCT_USAGET_VALUE,
    path,
    oldUsaget,
    newUsaget
  };
}

export function onRateAdd(path) {
  return {
    type: ADD_PRODUCT_RATE,
    path
  };
}

export function onRateRemove(path, index) {
  return {
    type: REMOVE_PRODUCT_RATE,
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
      },
      failure => {
        const errorMessages = failure.error.map( (response) => response.error.message);
        dispatch(showDanger(errorMessages));
        dispatch(finishProgressIndicator());
        callback(failure);
      }
    ).catch(
      error => { dispatch(apiBillRunErrorHandler(error)); }
    );
  };
}

function gotProduct(product) {
  return {
    type: GOT_PRODUCT,
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
