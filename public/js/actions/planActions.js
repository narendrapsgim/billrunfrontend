export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GET_PLAN = 'GET_PLAN';
export const GOT_PLAN = 'GOT_PLAN';
export const GOT_PRODUCT = 'GOT_PRODUCT';
export const CLEAR_PLAN = 'CLEAR_PLAN';
export const GET_PRODUCT = 'GET_PRODUCT';
export const SAVE_PLAN = 'SAVE_PLAN';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function updatePlanField(section, field_name, field_value) {
  return {
    type: UPDATE_PLAN_FIELD_VALUE,
    section,
    field_name,
    field_value
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

function gotPlan(plan) {
  return {
    type: GOT_PLAN,
    plan
  };
}

function fetchPlan(plan_id) {
  const convert = (plan) => {
    return {
      basic_settings: {
        PlanName: plan.name
      }
    };
  };

  let fetchUrl = `/api/find?collection=plans&query={"_id": {"$in": ["${plan_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        let p = _.values(resp.data.details)[0];
        dispatch(gotPlan(convert(p)));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };
}


export function getPlan(plan_id) {
  return dispatch => {
    return dispatch(fetchPlan(plan_id));
  };
}

export function clearPlan() {
  return {
    type: CLEAR_PLAN
  };
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
      product_properties: {
        ProductName: product.key,
        properties: []
      }
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

export function savePlan() {
  return {
    type: SAVE_PLAN
  };
}
