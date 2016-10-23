export const GOT_PLAN = 'GOT_PLAN';
export const SAVE_PLAN = 'SAVE_PLAN';
export const CLEAR_PLAN = 'CLEAR_PLAN';
export const ADD_TARIFF = 'ADD_TARIFF';
export const REMOVE_TARIFF = 'REMOVE_TARIFF';
export const UPDATE_PLAN_CYCLE = 'UPDATE_PLAN_CYCLE';
export const UPDATE_PLAN_PRICE = 'UPDATE_PLAN_PRICE';
export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const REMOVE_GROUP = 'REMOVE_GROUP';
export const ADD_GROUP = 'ADD_GROUP';

import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { showDanger, showSuccess } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';


export function clearPlan() {
  return {
    type: CLEAR_PLAN
  };
}

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

export function onGroupRemove(groupName, usage, productKeys) {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys] ;
  return {
    type: REMOVE_GROUP,
    groupName,
    usage,
    productKeys : keys
  };
}

export function onGroupAdd(groupName, usage, value, shared) {
  return {
    type: ADD_GROUP,
    groupName,
    usage,
    value,
    shared
  };
}

export function getPlan(plan_id) {
  return dispatch => {
    return dispatch(fetchPlan(plan_id));
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

  let from = moment(); //.format(globalSetting.apiDateTimeFormat)
  let to = moment().add(100, 'years'); //.format(globalSetting.apiDateTimeFormat)
  plan = plan.set('from', from).set('to', to);

  if (action !== 'new') {
    formData.append('id', plan.getIn(['_id','$id']));
  }
  formData.append("coll", 'plans');
  formData.append("type", type);
  /* HARD CODED */
  formData.append("data", JSON.stringify(plan.setIn(['recurrence', 'unit'], 1)));

  console.log("Save plan : ", plan.toJS());

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
        //TODO : Reload plan by key when plan view will be by key
        callback(true);
      },
      failure => {
        const errorMessages = failure.error.map( (response) => response.error.message );
        dispatch(showDanger(errorMessages));
        dispatch(finishProgressIndicator());
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

function fetchPlan(id) {
  const query = {
    api: "find",
    params: [
      { collection: "plans" },
      { size: "1" },
      { page: "0" },
      { query: JSON.stringify(
        {"_id" :  {"$in": [id]}}
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
