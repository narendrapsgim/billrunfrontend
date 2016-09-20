export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const ADD_TARIFF = 'ADD_TARIFF';
export const REMOVE_TARIFF = 'REMOVE_TARIFF';
export const UPDATE_PLAN_CYCLE = 'UPDATE_PLAN_CYCLE';
export const UPDATE_PLAN_PRICE = 'UPDATE_PLAN_PRICE';

export const SAVE_PLAN = 'SAVE_PLAN';
export const GET_PLAN = 'GET_PLAN';
export const GOT_PLAN = 'GOT_PLAN';
export const CLEAR_PLAN = 'CLEAR_PLAN';

export const REMOVE_INCLUDE = 'REMOVE_INCLUDE';
export const ADD_INCLUDE = 'ADD_INCLUDE';
export const CHNAGE_INCLUDE = 'CHNAGE_INCLUDE';

import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { showDanger, showSuccess } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';


export function onPlanFieldUpdate(path, value) {
  return {
    type: UPDATE_PLAN_FIELD_VALUE,
    path,
    value
  };
}

export function onPlanCycleUpdate(index, value) {
  return {
    type: UPDATE_PLAN_CYCLE,
    index,
    value,
  };
}

export function onPlanPriceUpdate(index, value) {
  return {
    type: UPDATE_PLAN_PRICE,
    index,
    value,
  };
}

export function onPlanTariffAdd(trial) {
  return {
    type: ADD_TARIFF,
    trial
  };
}

export function onPlanTariffRemove(index) {
  return {
    type: REMOVE_TARIFF,
    index
  };
}

export function removePlanInclude(groupName, usaget) {
  return {
    type: REMOVE_INCLUDE,
    groupName,
    usaget
  };
}

export function addPlanInclude(groupName, usaget, value) {
  return {
    type: ADD_INCLUDE,
    groupName,
    usaget,
    value
  };
}

export function changePlanInclude(groupName, usaget, value) {
  return {
    type: CHNAGE_INCLUDE,
    groupName,
    usaget,
    value
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

export function savePlan(plan, action, callback = () => {}) {
  return dispatch => {
    return dispatch(savePlanToDB(plan, action, callback));
  };
}

/* Internal function */
function savePlanToDB(plan, action, callback) {
  const type = action !== 'new' ? "close_and_new" : action;
  const formData = new FormData();
  if (action !== 'new') {
    formData.append('id', plan.getIn(['_id','$id']));
  }
  formData.append("coll", 'plans');
  formData.append("type", type);
  formData.append("data", JSON.stringify(plan));

  const query = [{
    api: "save",
    options: {
      method: "POST",
      body: formData
    },
  }];

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(showSuccess("Plan saved successfully"));
        dispatch(finishProgressIndicator());
        callback(success);
      },
      failure => {
        let errorMessages = failure.error.map( (response) => response.error.message);
        dispatch(showDanger(errorMessages));
        dispatch(finishProgressIndicator());
        callback(failure);
      }
    ).catch(
      error => { dispatch(apiBillRunErrorHandler(error)); }
    );
  };
}

function gotPlan(plan) {
  return {
    type: GOT_PLAN,
    plan
  };
}

function fetchPlan(plan_id) {
  const query = {
    api: "find",
    params: [
      { collection: "plans" },
      { size: "1" },
      { page: "0" },
      { query: JSON.stringify(
        {"_id" :  {"$in": [plan_id]}}
      )},
    ]
  };

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      resp => {
        let plan = _.values(resp.data[0].data.details)[0]
        dispatch(gotPlan(plan));
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
