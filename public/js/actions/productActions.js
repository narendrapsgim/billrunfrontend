export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GOT_PRODUCT = 'GOT_PRODUCT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function updateProductPropertiesField(field_name, field_idx, field_value) {
  return {
    type: UPDATE_PRODUCT_PROPERTIES_VALUE,
    field_name,
    field_idx,
    field_value
  }
}

export function addProductProperties() {
  return {
    type: ADD_PRODUCT_PROPERTIES    
  }
}

export function removeProductProperties(idx) {
  return {
    type: REMOVE_PRODUCT_PROPERTIES,
    idx
  }
}

function gotProduct(product) {
  return {
    type: GOT_PRODUCT,
    product
  }
}

function fetchProduct(product_id) {
  const convert = (product) => {
    return {
      key: product.key,
      rates: product.rates.call.rate.map(rate => {
        return {
          price: parseInt(rate.price, 10),
          to: parseInt(rate.to, 10),
          interval: parseInt(rate.interval, 10),
          from: rate.from ? parseInt(rate.from, 10) : rate.from
        }
      })
    };
  };

  let fetchUrl = `/api/find?collection=rates&query={"_id": {"$in": ["${product_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        let p = _.values(resp.data.details)[0];
        dispatch(gotProduct(convert(p)));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };
}

export function getProduct(product_id) {
  return dispatch => {
    return dispatch(fetchProduct(product_id));
  };
}

export function saveProduct() {
  return {
    type: SAVE_PRODUCT
  };
}
