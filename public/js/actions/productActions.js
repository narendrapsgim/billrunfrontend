export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const UPDATE_PRODUCT_PREFIXES = 'UPDATE_PRODUCT_PREFIXES';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GOT_PRODUCT = 'GOT_PRODUCT';
export const SAVE_PRODUCT = 'SAVE_PRODUCT';
export const CLEAR_PRODUCT = 'CLEAR_PRODUCT';

import axios from 'axios';
import moment from 'moment';
import Immutable from 'immutable';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showModal } from './modalActions';
import { showStatusMessage } from '../actions';
import { apiBillRun } from '../Api';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function buildRateFromState(state) {
  const product = state.toJS();
  const { rates, params } = product;
  let r = {
    [product.unit]: {
      BASE: {
        rate: rates.map(rate => {
          return {
            from: parseInt(rate.from, 10),
            to: parseInt(rate.to, 10),
            price: parseInt(rate.price, 10),
            interval: parseInt(rate.interval, 10)
          }
        })
      }
    }
  }

  return {
    key: product.key,
    id: product.id,
    from: product.from,
    to: product.to,
    code: product.code,
    unit_price: product.unit_price,
    description: product.description,
    params: params,
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

export function updateProductPrefixes(field_value) {
  return {
    type: UPDATE_PRODUCT_PREFIXES,
    field_value
  };
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
      params: product.params,
      code: product.code,
      from: product.from,
      to: product.to,
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
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}

export function getProduct(product_id) {
  return dispatch => {
    return dispatch(fetchProduct(product_id));
  };
}

function saveRateToDB(rate, action, callback) {
  let saveUrl = '/admin/save';

  var formData = new FormData();
  if (action !== 'new') formData.append('id', rate.id);
  formData.append("coll", 'rates');
  formData.append("type", action);
  formData.append("data", JSON.stringify(rate));

  const query = {
    queries: [{
      request: {
        api: "save",
        options: { form: true },
        formData
      }
    }]
  };

  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then((resp) => {
      const error = resp.data[0].error;
      if (error) {
        dispatch(showModal(error.message, "Error!"));
      } else {
        dispatch(showStatusMessage("Saved plan successfully!", 'success'));
      }
      dispatch(hideProgressBar());
      callback(resp, error);
    }).catch(error => {
      console.log("CATCH", error);
      if (error.data.message) {
        dispatch(showModal(error.data.message, "Error!"));
      } else {
        console.log(error);
        dispatch(showModal("Network error!", "Error!"));
      }
      dispatch(hideProgressBar());
    });
  };
}

export function saveProduct(rate, action, callback = () => {}) {
  if (!rate.get('unit'))
    return dispatch => {
      return dispatch(showModal("Must specify a unit type!", "Error!"));
    };
  const conv = buildRateFromState(rate);
  return dispatch => {
    return dispatch(saveRateToDB(conv, action, callback));
  };
}

export function clearProduct() {
  return {
    type: CLEAR_PRODUCT
  };
}


export function convert(product, plan = 'BASE'){
  let unit = _.keys(product.rates)[0];
  return {
    key: product.key,
    id: product._id.$id,
    from: product.from,
    to: product.to,
    code: product.code,
    unit,
    unit_price: product.unit_price,
    description: product.description,
    rates: product.rates[unit][plan].rate.map(rate => {
      return {
        price: parseInt(rate.price, 10),
        to: parseInt(rate.to, 10),
        interval: parseInt(rate.interval, 10),
        from: rate.from ? parseInt(rate.from, 10) : rate.from
      }
    })
  };
};
