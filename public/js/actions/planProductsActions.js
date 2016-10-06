export const PLAN_PRODUCTS_CLEAR = 'PLAN_PRODUCTS_CLEAR';
export const PLAN_PRODUCTS_SET = 'PLAN_PRODUCTS_SET';
export const PLAN_PRODUCTS_INIT = 'PLAN_PRODUCTS_INIT';
export const PLAN_PRODUCTS_RESTORE = 'PLAN_PRODUCTS_RESTORE';
export const PLAN_PRODUCTS_REMOVE = 'PLAN_PRODUCTS_REMOVE';
export const PLAN_PRODUCTS_UNDO_REMOVE = 'PLAN_PRODUCTS_UNDO_REMOVE';
export const PLAN_PRODUCTS_RATE_ADD = 'PLAN_PRODUCTS_RATE_ADD';
export const PLAN_PRODUCTS_RATE_INIT = 'PLAN_PRODUCTS_RATE_INIT';
export const PLAN_PRODUCTS_RATE_UPDATE = 'PLAN_PRODUCTS_RATE_UPDATE';
export const PLAN_PRODUCTS_RATE_REMOVE = 'PLAN_PRODUCTS_RATE_REMOVE';

import moment from 'moment';
import { buildSaveProductQuery } from './productActions';
import { showDanger, showSuccess, showWarning } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler} from '../common/Api';

function getExistPlanProductsByUsageTypes(planName, usageTypes = []) {
  return dispatch => {
    if(!usageTypes.length){
      return dispatch(showWarning('Usage types not found'));
    }
    if(!planName){
      return dispatch(showWarning('No plan name'));
    }
    let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
    let queryString = {
      '$or':  usageTypes.map((type) => {
								return { [`rates.${type}.${planName}`] : { '$exists' : true } };
							}),
      'to': {'$gte' : toadyApiString},
      'from': {'$lte' : toadyApiString}
    };

    let query = {
      api: 'find',
      params: [
        { collection: 'rates' },
        { size: '20' },
        { page: '0'},
        { query: JSON.stringify(queryString) },
      ]
    };

    apiBillRun(query).then(
      success => {
        let poducts = _.values(success.data[0].data.details);
        dispatch(initPlanProducts(poducts, planName));
      },
      failure => { throw failure; }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  };
}

function gotPlanProducts(products, planName) {
  return {
    type: PLAN_PRODUCTS_SET,
    products,
    planName
  };
}

function initPlanProducts(products, planName) {
  return {
    type: PLAN_PRODUCTS_INIT,
    products,
    planName,
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
  };
}

export function planProductsRateAdd(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RATE_ADD,
    productKey,
    path
  };
}

export function planProductsRateInit(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RATE_INIT,
    productKey,
    path
  };
}

export function planProductsRateRemove(productKey, path, idx) {
  return {
    type: PLAN_PRODUCTS_RATE_REMOVE,
    productKey,
    path,
    idx
  };
}

export function planProductsClear(){
  return {
    type: PLAN_PRODUCTS_CLEAR,
  };
}

export function getUsageTypes(){
    let query = [{
      api: 'settings',
      params: [ { category: 'usage_types' } ]
    }];
    return apiBillRun(query);
}

export function getExistPlanProducts(planName) {
  return dispatch => {
    return getUsageTypes().then(
      success => {
        dispatch( getExistPlanProductsByUsageTypes(planName, success.data[0].data.details) );
      },
      failure => { throw failure; }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  };
}

export function getProductByKey(key, planName) {
  if(key && key.length){
    return dispatch => {
      let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
      let query = {
        api: 'find',
        params: [
          { collection: 'rates' },
          { size: '2' },
          { page: '0' },
          { query: JSON.stringify({
              'key': key,
              'to': {'$gte' : toadyApiString},
              'from': {'$lte' : toadyApiString},
          }) },
        ]
      };

      apiBillRun(query).then(
        success => {
          let poducts = _.values(success.data[0].data.details);
          dispatch(gotPlanProducts(poducts, planName));
        },
        failure => { throw failure; }
      ).catch(
        error => dispatch(apiBillRunErrorHandler(error))
      );
    };
  }
}

export function savePlanRates(callback) {
  return (dispatch, getState) => {
    const { planProducts, plan } =  getState();

    // var productsKeysToSave = new Set();
    // //Get products
    // planProducts.get('productPlanPrice').forEach( (prodName) => {
    //   productsKeysToSave.add(prodName);
    // });
    // planProducts.get('productIncludeGroup').forEach( (group) => {
    //   group.forEach( (usaget) => {
    //     usaget.map( (pord) => {
    //       productsKeysToSave.add(pord.key);
    //     });
    //   });
    // });
    const queries = planProducts.get('planProducts')
      // .filter( prod => productsKeysToSave.has(prod.get('key')))
      .map( prod => buildSaveProductQuery(prod, 'update')).toArray();

    if(queries.length){
      apiBillRun(queries).then(
        sussess => {
          const prodNames = sussess.data.map( (response) => response.name );
          let successMessage = prodNames.length ? 'Products' : 'Product';
          successMessage += ' ' + prodNames.join(', ') + ' successfully updated';
          dispatch(showSuccess( successMessage ));
          //TODO : reload ratea by key
          callback(sussess);
        },
        failure => {
          let errorMessages = failure.error.map( (response) => `${response.name}: ${response.error.message}` );
          dispatch(showDanger(errorMessages));
          //TODO : reload sussessed rates by key
        }
      ).catch(
        error => { dispatch(apiBillRunErrorHandler(error)); }
      );
    } else {
      callback(true);
    }
  };
}
