export const PLAN_INCLUDE_GROUP_PRODUCTS_SET = 'PLAN_INCLUDE_GROUP_PRODUCTS_SET';
export const PLAN_INCLUDE_GROUP_PRODUCTS_ADD = 'PLAN_INCLUDE_GROUP_PRODUCTS_ADD';
export const PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE = 'PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE';
export const PLAN_INCLUDE_GROUP_REMOVE = 'PLAN_INCLUDE_GROUP_REMOVE';
export const PLAN_INCLUDE_GROUP_UPDATE = 'PLAN_INCLUDE_GROUP_UPDATE';
export const PLAN_INCLUDE_GROUP_ADD = 'PLAN_INCLUDE_GROUP_ADD';

import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler} from '../common/Api';

export function getGroupProducts(groupName, usaget) {
  const toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
  const query = {
    api: "find",
    params: [
      { collection: "rates" },
      { query: JSON.stringify({
        [`rates.${usaget}.groups`]: { "$in": [groupName] },
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
        usage: usaget,
        products
      });
    }).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

export function removeGroupProducts(groupName, usaget, productKeys) {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys] ;
  return {
    type: PLAN_INCLUDE_GROUP_PRODUCTS_REMOVE,
    group: groupName,
    usage: usaget,
    keys
  }
}

export function addGroupProducts(groupName, usaget, productKeys) {
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
        usage: usaget,
        products
      });
    }).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  }
}

export function getExistGroupProductsByUsageTypes(groupName, usageType){
    let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
    let queryString = {
      [`rates.${usageType}.groups`]: {"$in":[groupName]},
      'to': {"$gte" : toadyApiString},
      'from': {"$lte" : toadyApiString}
    };

    let query = {
      api: "find",
      params: [
        { collection: "rates" },
        { query: JSON.stringify(queryString) },
      ]
    };
    return apiBillRun(query);
}

export function getAllGroup(){
  let toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);
  let queryString = {
    "include.groups":{"$exists": true},
    'to': {"$gte" : toadyApiString},
    'from': {"$lte" : toadyApiString}
  };

  let query = {
    api: "find",
    params: [
      { collection: "plans" },
      { query: JSON.stringify( queryString   ) },
      { project: JSON.stringify( {"name":1, "include":1} ) },
    ]
  };
  return apiBillRun(query);
}
