export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PLAN_RECURRING_PRICE_VALUE = 'UPDATE_PLAN_RECURRING_PRICE_VALUE';
export const ADD_TARIFF = 'ADD_TARIFF';
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

export function updatePlanRecurringPriceField(field_name, field_idx, field_value) {
  return {
    type: UPDATE_PLAN_RECURRING_PRICE_VALUE,
    field_name,
    field_idx,
    field_value
  };
}

export function addTariff() {
  return {
    type: ADD_TARIFF
  };
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
        PlanName: plan.name,
        recurring_prices: []
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

export function savePlan() {
  return {
    type: SAVE_PLAN
  };
}
