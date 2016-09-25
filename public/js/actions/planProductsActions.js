export const PLAN_PRODUCTS_INIT = 'PLAN_PRODUCTS_INIT';
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
import { showDanger, showSuccess } from './alertsActions';
import { showAlert } from '../actions/alertsActions';
import { apiBillRun, apiBillRunErrorHandler} from '../common/Api';


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
  }
}

export function planProductsRateAdd(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RATE_ADD,
    productKey,
    path
  }
}

export function planProductsRateInit(productKey, path) {
  return {
    type: PLAN_PRODUCTS_RATE_INIT,
    productKey,
    path
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

export function getExistPlanProducts(planName) {
  return dispatch => {
    return getUsageTypes().then(
      success => { dispatch(getExistPlanProductsByUsageTypes(planName, success.data[0].data.details)) },
      failure => { throw failure }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

export function getUsageTypes(){
    let query = [{
      api: "settings",
      params: [ { category: "usage_types" } ]
    }];
    return apiBillRun(query);
}

function getExistPlanProductsByUsageTypes(planName, usageTypes = []) {
  return dispatch => {
    if(!usageTypes.length){
      return dispatch(showAlert('Usage types not found', 'warning'));
    }
    if(!planName){
      return dispatch(showAlert('No plan name', 'warning'));
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
        let poducts = _.values(success.data[0].data.details);
        dispatch(initPlanProducts(poducts, planName));
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

export function savePlanRates(callback) {
    return (dispatch, getState) => {
      const { planProducts, plan } =  getState();
      var planName = plan.get('PlanName');
      let queries = [];
      planProducts.get('planProducts').forEach( prod => {
        prod = prod.delete('uiflags');
        let from = moment(); //.format(globalSetting.apiDateTimeFormat)
        let to = moment().add(100, 'years'); //.format(globalSetting.apiDateTimeFormat)
        prod = prod.set('from', from).set('to', to);


        var formData = new FormData();
        formData.append('id', prod.getIn(['_id', '$id']));
        formData.append('coll', 'rates');
        formData.append('type', 'close_and_new');
        formData.append('data', JSON.stringify(prod));

        console.log("Save product : ", prod.toJS());

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
          dispatch(showSuccess(successMessages.join(', ') + " successfully updated", 'success'));
          dispatch(getExistPlanProducts(planName));
          // callback(sussess);
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
