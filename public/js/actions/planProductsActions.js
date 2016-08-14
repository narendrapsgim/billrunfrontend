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
      response => {
        if(response.data && response.data[0] && response.data[0].data){
          return dispatch(getExistPlanProductsByUsageTypes(planName, response.data[0].data, reset));
        }
        return dispatch(apiBillRunErrorHandler(response));
      },
      error => dispatch(apiBillRunErrorHandler(error))
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

function getUsageTypes(){
    let query = {
      queries : [{
        request: {
          api: "settings",
          params: [ { category: "usage_types" } ]
        }
      }]
    };
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
      'to':   {"$gte" : toadyApiString},
      'from': {"$lte" : toadyApiString}
    };

    let query = {
      queries : [{
        request: {
          api: "find",
          params: [
            { collection: "rates" },
            { size: "20" },
            { page: "0" },
            { query: JSON.stringify(queryString) },
          ]
        }
      }]
    };

    apiBillRun(query).then(
      response => {
        if(response.data){
          var poducts = [];
          response.data.forEach( res => {
            _.values(res.data).forEach(prod => {
                var unit = Object.keys(prod.rates)[0];
                prod.uiflags = {
                  existing: true,
                  originValue: prod.rates[unit][planName].rate.concat()
                };
                poducts.push(prod);
            });
          });
          return dispatch(gotPlanProducts(poducts, planName, reset));
        } else {
          return dispatch(apiBillRunErrorHandler(response))
        }
      },
      error => dispatch(apiBillRunErrorHandler(response))
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
        queries : [{
          request: {
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
          }
        }]
      };

      apiBillRun(query).then(
        response => {
          if(response.data){
            var poducts = [];
            var unit = '';
            response.data.forEach( res => {
               _.values(res.data).forEach(prod => poducts.push(prod));
             });
            return dispatch(gotPlanProducts(poducts, planName));
          } else {
            return dispatch(apiBillRunErrorHandler(response))
          }
        },
        error => dispatch(apiBillRunErrorHandler(response))
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
      let saveRequest = { queries:[]};
      planProducts.forEach( prod => {
        var formData = new FormData();
        formData.append('id', prod.getIn(['_id', '$id']));
        formData.append('coll', 'rates');
        formData.append('type', 'update');
        formData.append('data', JSON.stringify(prod.delete('uiflags')));

        var q = {
          request: {
            api: "save",
            name: prod.get('key'),
            options: {
              method: "POST",
              body: formData
            }
          }
        };
        saveRequest.queries.push(q)
      });

      apiBillRun(saveRequest).then(
        response => {
          var errorMessage = [];
          var successMessage = [];
          if(response.data){
            response.data.forEach( (res) => {
              if(res.hasOwnProperty("error")){
                errorMessage.push(res.name + ": " + res.error.message);
              } else {
                successMessage.push(res.data.key);
              }
            });

            if(errorMessage.length){
              dispatch(showModal(errorMessage, "Error!"));
            } else {
              dispatch(showStatusMessage(successMessage.join(', ') + " successfully updated", 'success'));
              dispatch(getExistPlanProducts(planName, true));
            }

          } else { dispatch(apiBillRunErrorHandler(response)); }
        },
        error => { dispatch(apiBillRunErrorHandler(error)); }
      ).catch(
        error => { dispatch(apiBillRunErrorHandler(error)); }
      );
    };
}
