export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PLAN_RECURRING_PRICE_VALUE = 'UPDATE_PLAN_RECURRING_PRICE_VALUE';
export const ADD_TARIFF = 'ADD_TARIFF';
export const GET_PLAN = 'GET_PLAN';
export const GOT_PLAN = 'GOT_PLAN';
export const CLEAR_PLAN = 'CLEAR_PLAN';
export const GET_PRODUCT = 'GET_PRODUCT';
export const SAVE_PLAN = 'SAVE_PLAN';
export const REMOVE_RECURRING_PRICE = 'REMOVE_RECURRING_PRICE';
export const REMOVE_INCLUDE = 'REMOVE_INCLUDE';
export const ADD_INCLUDE = 'ADD_INCLUDE';
export const CHNAGE_INCLUDE = 'CHNAGE_INCLUDE';

import axios from 'axios';
import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { showDanger, showSuccess } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function buildPlanFromState(state) {
  let basic_settings = state.toJS();
  let prices = [];

  let { TrialPrice, TrialCycle } = basic_settings;
  if (TrialPrice && TrialCycle) {
    let trial_from = moment().format();
    let trial = {
      trial: true,
      price: parseInt(TrialPrice, 10),
      Cycle: TrialCycle,
      TrialCycle,
      from: 0,
      to: parseInt(TrialCycle, 10)
    };
    prices.push(trial);
  }

  let p = _.reduce(basic_settings.recurring_prices, (acc, price, idx) => {
    if (!price.PeriodicalRate) return acc;

    let from = 0;
    if (acc.length && acc.length > idx) {
      from = acc[idx]['to'];
    } else if (idx > 0) {
      from = acc[idx - 1]['to']
    }
    let to = basic_settings.recurring_prices.length === idx+1 ? 999999999 : from + parseInt(price.Cycle, 10);
    acc.push({
      price: parseInt(price.PeriodicalRate, 10),
      Cycle: price.Cycle,
      from,
      to
    });
    return acc;
  }, prices);

  return {
    id: basic_settings.id,
    name: basic_settings.PlanName,
    price: prices,
    from: moment().format(),
    to: moment().add(100, 'years').format(),
    description: basic_settings.PlanDescription,
    PlanCode: basic_settings.PlanCode,
    upfront: basic_settings.ChargingMode === "upfront",
    recurrence: {
      unit: 1,//parseInt(basic_settings.Each, 10),
      periodicity: basic_settings.EachPeriod.toLowerCase()
    },
    include: basic_settings.include
  };
}

export function updatePlanField(field_name, field_value) {
  return {
    type: UPDATE_PLAN_FIELD_VALUE,
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

export function removeRecurringPrice(idx) {
  return {
    type: REMOVE_RECURRING_PRICE,
    idx
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

function gotPlan(plan) {
  return {
    type: GOT_PLAN,
    plan
  };
}

function fetchPlan(plan_id) {
  const convert = (plan) => {
    let Trial = {TrialPrice: undefined, TrialCycle: undefined};
    if (plan.price[0].trial) {
      Trial.TrialPrice = parseFloat(plan.price[0].price);
      Trial.TrialCycle = parseInt(plan.price[0].Cycle, 10);
    }
    const recurring_prices = _.reduce(plan.price, (acc, price) => {
      if (!price.trial) {
        acc.push({
          PeriodicalRate: price.price,
          Cycle: price.Cycle
        });
      }
      return acc;
    }, []);
    return {
      id: plan._id.$id,
      PlanDescription: plan.description,
      PlanCode: plan.PlanCode,
      PlanName: plan.name,
      to: moment(plan.to).unix() * 1000,
      from: moment(plan.from).unix() * 1000,
      EachPeriod: _.capitalize(plan.recurrence.periodicity),
      ChargingMode: (plan.upfront ? "upfront" : "arrears"),
      Each: plan.recurrence.unit,
        ...Trial,
      recurring_prices,
      include: plan.include
    };
  };

  let fetchUrl = `/api/find?collection=plans&query={"_id": {"$in": ["${plan_id}"]}}`;
  return (dispatch) => {
    dispatch(startProgressIndicator());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        let p = _.values(resp.data.details)[0];
        dispatch(gotPlan(convert(p)));
        dispatch(finishProgressIndicator());
      }
    ).catch(error => {
      console.log(error);
      if (error.data)
        dispatch(showDanger(error.data.message));
      dispatch(finishProgressIndicator());
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

function savePlanToDB(plan, action, callback) {
  const type = action !== 'new' ? "close_and_new" : action;
  const formData = new FormData();
  if (action !== 'new') {
    formData.append('id', plan.id);
  }
  formData.append("coll", 'plans');
  formData.append("type", type);
  formData.append("data", JSON.stringify(plan));

  const query = [{
    api: "save",
    name: "plan",
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
        callback(false);
      },
      failure => {
        let errorMessages = failure.error.map( (response) => `${response.name}: ${response.error.message}`);
        dispatch(showDanger(errorMessages));
        dispatch(finishProgressIndicator());
        callback(true);
      }
    ).catch(
      error => { dispatch(apiBillRunErrorHandler(error)); }
    );
  };
}

export function savePlan(plan, action, callback = () => {}) {
  console.log(plan);
  const conv = buildPlanFromState(plan);
  return dispatch => {
    return dispatch(savePlanToDB(conv, action, callback));
  };
}
