export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PRODUCT_PROPERTIES_VALUE = 'UPDATE_PRODUCT_PROPERTIES_VALUE';
export const ADD_PRODUCT_PROPERTIES = 'ADD_PRODUCT_PROPERTIES';
export const REMOVE_PRODUCT_PROPERTIES = 'REMOVE_PRODUCT_PROPERTIES';
export const GET_PLAN = 'GET_PLAN';
export const GOT_PLAN = 'GOT_PLAN';
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
  let plan = {
    basic_settings: {
      PlanName: 'Test',
      PlanCode: '123',
      PlanDescription: 'A plan description',
      TrialTransaction: '',
      PlanFee: '',
      TrialCycle: '',
      PeriodicalRate: '',
      Each: '',
      EachPeriod: "Month",
      Cycle: '',
      From: '',
      To: ''
    },
    product_properties: {
      ProductName: '',
      properties: [{
        ProductType:'',
        FlatRate:'',
        PerUnit:'',
        Type:''
      }]
    }
  };

  let fetchUrl = `/api/find?collection=plans&query={"_id": {"$in": ["${plan_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      response => {
        dispatch(gotPlan(plan));
        dispatch(hideProgressBar());
        //dispatch(gotSubscriber(response.data.details));
      }
    ).catch(error => {
      /** TODO: Remove and error handle **/
      dispatch(gotPlan(plan));
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

export function getProduct(product_id) {
  return {
    type: GET_PRODUCT,
    product_id
  };
}

export function savePlan() {
  return {
    type: SAVE_PLAN
  };
}
