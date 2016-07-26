export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GOT_PRODUCT = 'GOT_PRODUCT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT';

import axios from 'axios';
import moment from 'moment';
import Immutable from 'immutable';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});


function buildRateFromState(state) {
  const product = state.toJS();
  const { rates } = product;
  let r = {
    [product.unit]: {
      BASE: {
        rate: rates
      }
    }
  }
  return {
    key: product.key,
    id: product.id,
    from: moment(product.from).unix() * 1000,
    to: moment(product.to).unix() * 1000,
    unit_price: product.unit_price,
    description: product.description,
    rates: r
  };
}

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
    let unit = _.keys(product.rates)[0];
    return {
      key: product.key,
      id: product._id.$id,
      unit,
      unit_price: product.unit_price,
      description: product.description,
      rates: product.rates[unit].BASE.rate.map(rate => {
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

function savedRate() {
  return {
    type: 'test'
  };
}

function saveRateToDB(rate, action) {
  let saveUrl = '/admin/save';

  var formData = new FormData();
  if (action !== 'new') formData.append('id', rate.id);
  formData.append("coll", 'rates');
  formData.append("type", action);
  formData.append("data", JSON.stringify(rate));

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(saveUrl, formData).then(
      resp => {
        dispatch(savedRate());
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };
}

export function saveProduct(rate, action) {
  const conv = buildRateFromState(rate);
  return dispatch => {
    return dispatch(saveRateToDB(conv, action));
  };
}

export function clearProduct() {
  return {
    type: CLEAR_PRODUCT
  };
}
