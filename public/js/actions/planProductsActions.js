export const PLAN_PRODUCTS_SET = 'PLAN_PRODUCTS_SET';
export const PLAN_PRODUCTS_CLEAR = 'PLAN_PRODUCTS_CLEAR';
export const PLAN_PRODUCTS_REMOVE = 'PLAN_PRODUCTS_REMOVE';
export const PLAN_PRODUCTS_UNDO_REMOVE = 'PLAN_PRODUCTS_UNDO_REMOVE';
export const PLAN_PRODUCTS_RATE_ADD = 'PLAN_PRODUCTS_RATE_ADD';
export const PLAN_PRODUCTS_RATE_UPDATE = 'PLAN_PRODUCTS_RATE_UPDATE';
export const PLAN_PRODUCTS_RATE_REMOVE = 'PLAN_PRODUCTS_RATE_REMOVE';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import {showStatusMessage} from '../actions';

import { apiBillRun, delay} from '../Api';

function gotPlanProducts(products, planName) {
  return {
    type: PLAN_PRODUCTS_SET,
    products,
    planName
  };
}

function removePlanProducts(productKey, planName) {
  return {
    type: PLAN_PRODUCTS_REMOVE,
    productKey,
    planName
  };
}

function undoRemovePlanProducts(productKey) {
  return {
    type: PLAN_PRODUCTS_UNDO_REMOVE,
    productKey,
  };
}

function fetchProductsByQuery(query, planName, callback) {
  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then(
      response => {
        dispatch(callback(response.data, planName));
        dispatch(hideProgressBar());
      },
      error => dispatch(hideProgressBar())
    ).catch(
      error => dispatch(hideProgressBar())
    );
  };
}

export function getPlanProductsByQuery(planName, query) {
  return dispatch => {
    return dispatch(fetchProductsByQuery(query, planName, gotPlanProducts));
  };
}

export function removePlanProduct(productKey) {
  return (dispatch, getState) => {
    const { plan } =  getState();
    dispatch(showStatusMessage(`Product ${productKey} prices for plan  ${plan.get('PlanName')} will be removed after save`, 'info'));
    return dispatch(removePlanProducts(productKey, plan.get('PlanName')));
  };
}

export function undoRemovePlanProduct(productKey) {
  return dispatch => {
    dispatch(showStatusMessage(`Product ${productKey} prices restored`, 'info'));
    return dispatch(undoRemovePlanProducts(productKey));
  };
}

export function getExistPlanProducts(units) {
  if(units.length){
    return (dispatch, getState) => {
      const { plan } = getState();
      let planName = plan.get('PlanName');
      let queryArgs = {};
      queryArgs['$or'] = [];
      units.map((unit, i) => {
        queryArgs['$or'].push(
            { [`rates.${unit}.${planName}`] : { "$exists" : true } },
        );
      });

      let query = {
        queries : [{
          request: {
            api: "find",
            params: [
              { collection: "rates" },
              { size: "20" },
              { page: "0" },
              { query: JSON.stringify(queryArgs) },
            ]
          }
        }]
      };
      return dispatch(getPlanProductsByQuery(planName, query));
    };
  }
}

export function getProductByKey(key) {
  if(key && key.length){
    return (dispatch, getState) => {
      const { planProducts , plan } =  getState();
      if(!planProducts.some( (item) => item.get('key') === key)){
        let query = {
          queries : [{
            request: {
              api: "find",
              params: [
                { collection: "rates" },
                { size: "20" },
                { page: "0" },
                { query: JSON.stringify({"key": key}) },
              ]
            }
          }]
        };
        return dispatch(getPlanProductsByQuery(undefined, query));
      } else {
        return dispatch(showStatusMessage(`Price of product ${key} already overridden for plan ${plan.get('PlanName')}`, 'warning'));
      }

    };
  }
}

export function savePlanRates() {
    return (dispatch, getState) => {
      const { planProducts, plan } =  getState();
      planProducts.forEach( prod => {
        if(prod.get('removed')){
          console.log(`Delete product price of ${plan.get('PlanName')} :`, prod.toJS());
        } else {
          console.log(`Save product price of ${plan.get('PlanName')} :`, prod.toJS());
        }
      });
      // if(!planProducts.some( (item) => item.get('key') === key)){
      //   let query = {
      //     queries : [{
      //       request: {
      //         api: "find",
      //         params: [
      //           { collection: "rates" },
      //           { size: "20" },
      //           { page: "0" },
      //           { query: JSON.stringify({"key": key}) },
      //         ]
      //       }
      //     }]
      //   };
      //   return dispatch(getPlanProductsByQuery(undefined, query));
      // } else {
        return dispatch(showStatusMessage(`Updated`, 'warning'));
      // }

    };
}

export function planProductsRateUpdate(productKey, fieldName, fieldIdx, fieldValue) {
  return {
    type: PLAN_PRODUCTS_RATE_UPDATE,
    productKey,
    fieldName,
    fieldIdx,
    fieldValue
  }
}

export function planProductsRateAdd(productKey) {
  return {
    type: PLAN_PRODUCTS_RATE_ADD,
    productKey
  }
}

export function planProductsRateRemove(productKey, fieldIdx) {
  return {
    type: PLAN_PRODUCTS_RATE_REMOVE,
    productKey,
    fieldIdx
  }
}

export function planProductsClear(){
  return {
    type: PLAN_PRODUCTS_CLEAR,
  }
}
