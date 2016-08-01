export const UPDATE_PLAN_FIELD_VALUE = 'UPDATE_PLAN_FIELD_VALUE';
export const UPDATE_PLAN_RECURRING_PRICE_VALUE = 'UPDATE_PLAN_RECURRING_PRICE_VALUE';
export const ADD_TARIFF = 'ADD_TARIFF';
export const GET_PLAN = 'GET_PLAN';
export const GOT_PLAN = 'GOT_PLAN';
export const CLEAR_PLAN = 'CLEAR_PLAN';
export const GET_PRODUCT = 'GET_PRODUCT';
export const SAVE_PLAN = 'SAVE_PLAN';
export const REMOVE_RECURRING_PRICE = 'REMOVE_RECURRING_PRICE';

import axios from 'axios';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function getToDate(settings, from, cycle) {
  let amt = settings.EachPeriod.toLowerCase() + 's';
  let each = parseInt(settings.Each, 10);
  if (!cycle) {
    return moment(from).add(100, "years").format();
  }

  return moment(from).add(parseInt(cycle, 10) * each, amt).format();
}

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
      duration: {
        TrialCycle,
        from: trial_from,
        to: getToDate(basic_settings, trial_from, TrialCycle)
      }
    };
    prices.push(trial);
  }
  
  let p = _.reduce(basic_settings.recurring_prices, (acc, price, idx) => {
    if (!price.PeriodicalRate) return acc;

    let from = moment().format();
    let to = moment();

    if (acc.length && acc.length > idx) {
      from = moment(acc[idx]['duration']['to']).format();
    } else if (idx > 0) {
      from = moment(acc[idx - 1]['duration']['to']).format();
    }
    to = getToDate(basic_settings, from, price.Cycle);

    acc.push({
      price: parseInt(price.PeriodicalRate, 10),
      Cycle: price.Cycle,
      duration: {
        from,
        to
      }
    });
    return acc;
  }, prices);

  return {
    id: basic_settings.id,
    name: basic_settings.PlanName,
    price: prices,
    from: moment(parseInt(basic_settings.from)).format(),
    to: moment(parseInt(basic_settings.to)).format(),
    PlanDescription: basic_settings.PlanDescription,
    PlanCode: basic_settings.PlanCode,
    charging_mode: basic_settings.ChargingMode,
    recurring: {
      duration: parseInt(basic_settings.Each, 10),
      unit: basic_settings.EachPeriod.toLowerCase()
    }
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
      PlanDescription: plan.PlanDescription,
      PlanCode: plan.PlanCode,
      PlanName: plan.name,
      to: moment(plan.to).unix() * 1000,
      from: moment(plan.from).unix() * 1000,
      EachPeriod: _.capitalize(plan.recurring.unit),
      ChargingMode: plan.charging_mode,
      Each: plan.recurring.duration,
        ...Trial,
      recurring_prices
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

function savedPlan() {
  return {
    type: 'test'
  };
}

function savePlanToDB(plan, action) {
  let saveUrl = '/admin/save';

  var formData = new FormData();
  if (action !== 'new') formData.append('id', plan.id);
  formData.append("coll", 'plans');
  formData.append("type", action);
  formData.append("data", JSON.stringify(plan));

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(saveUrl, formData).then(
      resp => {
        dispatch(savedPlan());
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };  
};

export function savePlan(plan, action) {
  const conv = buildPlanFromState(plan);
  return dispatch => {
    return dispatch(savePlanToDB(conv, action));
  };
}
