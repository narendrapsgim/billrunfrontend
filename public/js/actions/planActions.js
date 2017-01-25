import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { fetchPlanByIdQuery, saveQuery } from '../common/ApiQueries';

export const PLAN_GOT = 'PLAN_GOT';
export const PLAN_SAVE = 'PLAN_SAVE';
export const PLAN_CLEAR = 'PLAN_CLEAR';
export const PLAN_ADD_TARIFF = 'PLAN_ADD_TARIFF';
export const PLAN_REMOVE_TARIFF = 'PLAN_REMOVE_TARIFF';
export const PLAN_UPDATE_PLAN_CYCLE = 'PLAN_UPDATE_PLAN_CYCLE';
export const PLAN_UPDATE_FIELD_VALUE = 'PLAN_UPDATE_FIELD_VALUE';

export const REMOVE_GROUP = 'REMOVE_GROUP';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_USAGET_INCLUDE = 'ADD_USAGET_INCLUDE';

export const PLAN_PRODUCTS_RATE_INIT = 'PLAN_PRODUCTS_RATE_INIT';
export const PLAN_PRODUCTS_RATE_ADD = 'PLAN_PRODUCTS_RATE_ADD';
export const PLAN_PRODUCTS_RATE_REMOVE = 'PLAN_PRODUCTS_RATE_REMOVE';
export const PLAN_PRODUCTS_RATE_UPDATE = 'PLAN_PRODUCTS_RATE_UPDATE';
export const PLAN_PRODUCTS_RATE_UPDATE_TO = 'PLAN_PRODUCTS_RATE_UPDATE_TO';
export const PLAN_PRODUCTS_REMOVE = 'PLAN_PRODUCTS_REMOVE';
export const PLAN_PRODUCTS_UNDO_REMOVE = 'PLAN_PRODUCTS_UNDO_REMOVE';


const gotPlan = plan => ({
  type: PLAN_GOT,
  plan,
});

const fetchPlan = id => (dispatch) => {
  const query = fetchPlanByIdQuery(id);
  dispatch(startProgressIndicator());
  return apiBillRun(query).then(
    (response) => {
      try {
        dispatch(finishProgressIndicator());
        const plan = response.data[0].data.details[0];
        dispatch(gotPlan(plan));
        return dispatch(apiBillRunSuccessHandler(response));
      } catch (e) {
        console.log('fetchPlan error: ', e);
        throw new Error(`Error retreiving plan ${id}`);
      }
    }
  ).catch((error) => {
    dispatch(apiBillRunErrorHandler(error));
    return false;
  });
};

function savePlanToDB(plan, action) {
  const type = action !== 'new' ? 'close_and_new' : action;
  const formData = new FormData();
  const from = moment();
  const to = moment().add(100, 'years');
  if (action !== 'new') {
    formData.append('id', plan.getIn(['_id', '$id']));
  }
  formData.append('coll', 'plans');
  formData.append('type', type);
  const planData = plan
    .setIn(['recurrence', 'unit'], 1)/* HARD CODED */
    .set('from', from)
    .set('to', to);

  console.log('Save plan : ', planData.toJS());
  formData.append('data', JSON.stringify(planData));
  const query = saveQuery(formData);
  return (dispatch) => {
    dispatch(startProgressIndicator());
    return apiBillRun(query)
      .then(success => dispatch(apiBillRunSuccessHandler(success, 'Plan saved successfully')))
      .catch(error => dispatch(apiBillRunErrorHandler(error)));
  };
}


export const onGroupRemove = (groupName, usage, productKeys) => {
  const keys = Array.isArray(productKeys) ? productKeys : [productKeys];
  return {
    type: REMOVE_GROUP,
    groupName,
    usage,
    productKeys: keys,
  };
};

export const onGroupAdd = (groupName, usage, value, shared) => ({
  type: ADD_GROUP,
  groupName,
  usage,
  value,
  shared,
});

// export const getProductByKey = key => (dispatch) => {
//   if (key && key.length) {
//     const query = getProductByKeyQuery(key);
//     apiBillRun(query).then(
//       (success) => {
//         try {
//           const poduct = success.data[0].data.details[0];
//           dispatch(gotPlanProducts([poduct]));
//         } catch (e) {
//           dispatch(apiBillRunErrorHandler(e, 'Error retrieving the product'));
//         }
//       }
//     ).catch((error) => {
//       dispatch(apiBillRunErrorHandler(error));
//     });
//   }
// };
//
//
// export const undoRemovePlanProduct = (path, price) => ({
//   type: PLAN_PRODUCTS_UNDO_REMOVE,
//   name,
// });

export const removePlanProduct = (path, name) => ({
  type: PLAN_PRODUCTS_REMOVE,
  path,
  name,
});

export const planProductsRateUpdateTo = (path, index, value) => ({
  type: PLAN_PRODUCTS_RATE_UPDATE_TO,
  path,
  index,
  value,
});

export const planProductsRateUpdate = (path, value) => ({
  type: PLAN_PRODUCTS_RATE_UPDATE,
  path,
  value,
});

export const planProductsRateInit = (product, path) => ({
  type: PLAN_PRODUCTS_RATE_INIT,
  product,
  path,
});

export const planProductsRateAdd = path => ({
  type: PLAN_PRODUCTS_RATE_ADD,
  path,
});

export const planProductsRateRemove = (path, index) => ({
  type: PLAN_PRODUCTS_RATE_REMOVE,
  path,
  index,
});

export const clearPlan = () => ({
  type: PLAN_CLEAR,
});

export const onPlanFieldUpdate = (path, value) => ({
  type: PLAN_UPDATE_FIELD_VALUE,
  path,
  value,
});

export const onPlanCycleUpdate = (index, value) => ({
  type: PLAN_UPDATE_PLAN_CYCLE,
  index,
  value,
});

export const onPlanTariffAdd = trial => ({
  type: PLAN_ADD_TARIFF,
  trial,
});

export const onPlanTariffRemove = index => ({
  type: PLAN_REMOVE_TARIFF,
  index,
});

export const addUsagetInclude = (usaget, pp_includes_name, pp_includes_external_id) => ({
  type: ADD_USAGET_INCLUDE,
  usaget,
  pp_includes_name,
  pp_includes_external_id,
});

export const getPlan = planId => dispatch => dispatch(fetchPlan(planId));

export const savePlan = (plan, action, callback = () => {}) => dispatch =>
    dispatch(savePlanToDB(plan, action, callback));
