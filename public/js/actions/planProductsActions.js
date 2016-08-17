export const PLAN_PRODUCTS_SET = 'PLAN_PRODUCTS_SET';
export const PLAN_PRODUCTS_CLEAR = 'PLAN_PRODUCTS_CLEAR';
export const PLAN_PRODUCTS_REMOVE = 'PLAN_PRODUCTS_REMOVE';
export const PLAN_PRODUCTS_RESTORE = 'PLAN_PRODUCTS_RESTORE';
export const PLAN_PRODUCTS_UNDO_REMOVE = 'PLAN_PRODUCTS_UNDO_REMOVE';
export const PLAN_PRODUCTS_RATE_ADD = 'PLAN_PRODUCTS_RATE_ADD';
export const PLAN_PRODUCTS_RATE_INIT = 'PLAN_PRODUCTS_RATE_INIT';
export const PLAN_PRODUCTS_RATE_UPDATE = 'PLAN_PRODUCTS_RATE_UPDATE';
export const PLAN_PRODUCTS_RATE_REMOVE = 'PLAN_PRODUCTS_RATE_REMOVE';

import moment from 'moment';
import { showModal } from './modalActions';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showStatusMessage } from '../actions';
import { apiBillRun, apiBillRunErrorHandler} from '../Api';


function gotPlanProducts(products, planName, reset = false) {
  return {
    type: PLAN_PRODUCTS_SET,
    products,
    planName,
    reset
  };
}

export function removePlanProduct(productKey, path) {
  return {
    type: PLAN_PRODUCTS_REMOVE,
    productKey,
    path
  };
}

export function restorePlanProduct(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RESTORE,
    productKey,
    path
  };
}

export function undoRemovePlanProduct(productKey, path) {
  return {
    type: PLAN_PRODUCTS_UNDO_REMOVE,
    productKey,
    path
  };
}

export function planProductsRateUpdate(productKey, path, value) {
  return {
    type: PLAN_PRODUCTS_RATE_UPDATE,
    productKey,
    path,
    value
  }
}

export function planProductsRateAdd(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RATE_ADD,
    productKey,
    path
  }
}

export function planProductsRateInit(productKey, planName, usageType) {
  return {
    type: PLAN_PRODUCTS_RATE_INIT,
    productKey,
    planName,
    usageType
  }
}

export function planProductsRateRemove(productKey, path, idx) {
  return {
    type: PLAN_PRODUCTS_RATE_REMOVE,
    productKey,
    path,
    idx
  }
}

export function planProductsClear(){
  return {
    type: PLAN_PRODUCTS_CLEAR,
  }
}

export function getExistPlanProducts(planName, reset = false) {
  return dispatch => {
    return getUsageTypes().then(
      success => { dispatch(getExistPlanProductsByUsageTypes(planName, success.data[0].data.details, reset)) },
      failure => { throw failure }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

function getUsageTypes(){
    let query = [{
      api: "settings",
      params: [ { category: "usage_types" } ]
    }];
    return apiBillRun(query);
}

function getExistPlanProductsByUsageTypes(planName, usageTypes = [], reset = false) {
  return dispatch => {
    if(!usageTypes.length){
      return dispatch(showStatusMessage('Usage types not found', 'warning'));
    }
    if(!planName){
      return dispatch(showStatusMessage('No plan name', 'warning'));
    }
    let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
    let queryString = {
      '$or':  usageTypes.map((type, i) => {
								return { [`rates.${type}.${planName}`] : { "$exists" : true } }
							}),
      'to': {"$gte" : toadyApiString},
      'from': {"$lte" : toadyApiString}
    };

    let query = {
      api: "find",
      params: [
        { collection: "rates" },
        { size: "20" },
        { page: "0" },
        { query: JSON.stringify(queryString) },
      ]
    };

    apiBillRun(query).then(
      success => {
        let poducts = _.values(success.data[0].data.details).map(prod => {
          var unit = Object.keys(prod.rates)[0];
          prod.uiflags = {
            existing: true,
            originValue: [...prod.rates[unit][planName].rate]
          };
          return prod;
        });
        dispatch(gotPlanProducts(poducts, planName, reset));
      },
      failure => { throw failure }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

export function getProductByKey(key, planName) {
  if(key && key.length){
    return dispatch => {
      let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
      let query = {
        api: "find",
        params: [
          { collection: "rates" },
          { size: "20" },
          { page: "0" },
          { query: JSON.stringify({
              "key": key,
              "to": {"$gte" : toadyApiString},
              "from": {"$lte" : toadyApiString},
          }) },
        ]
      };

      apiBillRun(query).then(
        success => {
          let poducts = _.values(success.data[0].data.details);
          dispatch(gotPlanProducts(poducts, planName));
        },
        failure => { throw failure }
      ).catch(
        error => dispatch(apiBillRunErrorHandler(error))
      );
    }
  }
}

export function savePlanRates() {
    return (dispatch, getState) => {
      const { planProducts, plan } =  getState();
      var planName = plan.get('PlanName');
      let queries = [];
      planProducts.forEach( prod => {
        var formData = new FormData();
        formData.append('id', prod.getIn(['_id', '$id']));
        formData.append('coll', 'rates');
        formData.append('type', 'update');
        formData.append('data', JSON.stringify(prod.delete('uiflags')));

        var query = {
          api: "save",
          name: prod.get('key'),
          options: {
            method: "POST",
            body: formData
          }
        };
        queries.push(query)
      });

      apiBillRun(queries).then(
        sussess => {
          let successMessages = sussess.data.map( (response) => response.name );
          dispatch(showStatusMessage(successMessages.join(', ') + " successfully updated", 'success'));
          dispatch(getExistPlanProducts(planName, true));
        },
        failure => {
          let errorMessages = failure.error.map( (response) => `${response.name}: ${response.error.message}`);
          dispatch(showModal(errorMessages, "Error!"));
        }
      ).catch(
        error => { dispatch(apiBillRunErrorHandler(error)); }
      );
    };
}
