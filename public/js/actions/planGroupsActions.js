export const PLAN_INCLUDE_GROUP_PRODUCTS_SET = 'PLAN_INCLUDE_GROUP_PRODUCTS_SET';
export const PLAN_INCLUDE_GROUP_PRODUCTS_ADD = 'PLAN_INCLUDE_GROUP_PRODUCTS_ADD';
export const PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE = 'PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE';
export const PLAN_INCLUDE_GROUP_REMOVE = 'PLAN_INCLUDE_GROUP_REMOVE';
export const PLAN_INCLUDE_GROUP_UPDATE = 'PLAN_INCLUDE_GROUP_UPDATE';
export const PLAN_INCLUDE_GROUP_ADD = 'PLAN_INCLUDE_GROUP_ADD';

import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler} from '../common/Api';

export function getGroupProducts(groupName, usage) {
  const toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
  const query = {
    api: "find",
    params: [
      { collection: "rates" },
      { query: JSON.stringify({
        [`rates.${usage}.groups`]: { "$in": [groupName] },
        'to': {"$gte" : toadyApiString},
        'from': {"$lte" : toadyApiString}
      }) },
    ]
  };
  const request = apiBillRun(query);

  return dispatch => {
    request.then( (response) => {
      return _.values(response.data[0].data.details);
    }).then( (products) => {
      dispatch({
        type: PLAN_INCLUDE_GROUP_PRODUCTS_SET,
        group: groupName,
        usage,
        products
      });
    }).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

export function removeGroupProducts(groupName, usage, productKeys) {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys] ;
  return {
    type: PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE,
    group: groupName,
    usage,
    productKeys : keys
  }
}

export function addGroupProducts(groupName, usage, productKeys) {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys] ;
  const toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
  const query = {
    api: "find",
    params: [
      { collection: "rates" },
      { query: JSON.stringify({
        'key': { "$in": keys },
        'to': {"$gte" : toadyApiString},
        'from': {"$lte" : toadyApiString}
      }) },
    ]
  };
  const request = apiBillRun(query);

  return dispatch => {
    request.then( (response) => {
      return _.values(response.data[0].data.details);
    }).then( (products) => {
      dispatch({
        type: PLAN_INCLUDE_GROUP_PRODUCTS_ADD,
        group: groupName,
        usage: usage,
        products
      });
    }).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}
