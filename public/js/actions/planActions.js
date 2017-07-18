import Immutable from 'immutable';
import { startProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { fetchPlanByIdQuery, getAllGroupsQuery, fetchPrepaidGroupByIdQuery } from '../common/ApiQueries';
import { saveEntity } from '../actions/entityActions';
import {
  getPlanConvertedRates,
  getPlanConvertedPpIncludes,
  getPlanConvertedPpThresholds,
  getPlanConvertedNotificationThresholds,
  getPlanConvertedIncludes,
} from '../common/Util';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
} from '../selectors/settingsSelector';

export const PLAN_GOT = 'PLAN_GOT';
export const PLAN_CLEAR = 'PLAN_CLEAR';
export const PLAN_ADD_TARIFF = 'PLAN_ADD_TARIFF';
export const PLAN_REMOVE_TARIFF = 'PLAN_REMOVE_TARIFF';
export const PLAN_UPDATE_PLAN_CYCLE = 'PLAN_UPDATE_PLAN_CYCLE';
export const PLAN_UPDATE_FIELD_VALUE = 'PLAN_UPDATE_FIELD_VALUE';
export const PLAN_REMOVE_FIELD = 'PLAN_REMOVE_FIELD';
export const PLAN_CLONE_RESET = 'PLAN_CLONE_RESET';

export const REMOVE_GROUP_PLAN = 'REMOVE_GROUP_PLAN';
export const ADD_GROUP_PLAN = 'ADD_GROUP_PLAN';
export const ADD_USAGET_INCLUDE = 'ADD_USAGET_INCLUDE';

export const PLAN_PRODUCTS_RATE_INIT = 'PLAN_PRODUCTS_RATE_INIT';
export const PLAN_PRODUCTS_RATE_ADD = 'PLAN_PRODUCTS_RATE_ADD';
export const PLAN_PRODUCTS_RATE_REMOVE = 'PLAN_PRODUCTS_RATE_REMOVE';
export const PLAN_PRODUCTS_RATE_UPDATE = 'PLAN_PRODUCTS_RATE_UPDATE';
export const PLAN_PRODUCTS_RATE_UPDATE_TO = 'PLAN_PRODUCTS_RATE_UPDATE_TO';
export const PLAN_PRODUCTS_REMOVE = 'PLAN_PRODUCTS_REMOVE';


const gotItem = plan => ({
  type: PLAN_GOT,
  plan,
});

export const clearPlan = () => ({
  type: PLAN_CLEAR,
});

export const onGroupRemove = groupName => ({
  type: REMOVE_GROUP_PLAN,
  groupName,
});

export const onGroupAdd = (groupName, usage, unit, value, shared, pooled, products) => ({
  type: ADD_GROUP_PLAN,
  groupName,
  usage,
  unit,
  value,
  shared,
  pooled,
  products,
});

export const planProductRemove = (path, name) => ({
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

export const onPlanFieldUpdate = (path, value) => ({
  type: PLAN_UPDATE_FIELD_VALUE,
  path,
  value,
});

export const onPlanFieldRemove = path => ({
  type: PLAN_REMOVE_FIELD,
  path,
});

export const onPlanCycleUpdate = (index, value) => ({
  type: PLAN_UPDATE_PLAN_CYCLE,
  index,
  value,
});

export const onPlanTariffAdd = (trial = false) => ({
  type: PLAN_ADD_TARIFF,
  trial,
});

export const onPlanTariffRemove = index => ({
  type: PLAN_REMOVE_TARIFF,
  index,
});

export const setClonePlan = () => ({
  type: PLAN_CLONE_RESET,
  uniquefields: ['name'],
});

export const addUsagetInclude = (ppIncludesName, ppIncludesExternalId, unitLabel) => ({
  type: ADD_USAGET_INCLUDE,
  ppIncludesName,
  ppIncludesExternalId,
  unitLabel,
});

const convertPlan = (getState, plan, convertToBaseUnit) => {
  const isPrepaidPlan = plan.get('connection_type', '') === 'prepaid';
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const ppIncludes = state.list.get('pp_includes');
  const rates = getPlanConvertedRates(propertyTypes, usageTypesData, plan, convertToBaseUnit);
  const ppThresholds = isPrepaidPlan
    ? getPlanConvertedPpThresholds(propertyTypes, usageTypesData, ppIncludes, plan, convertToBaseUnit) // eslint-disable-line max-len
    : null;
  const notificationsThresholds = isPrepaidPlan
    ? getPlanConvertedNotificationThresholds(propertyTypes, usageTypesData, ppIncludes, plan, convertToBaseUnit) // eslint-disable-line max-len
    : null;
  const planIncludes = !isPrepaidPlan
    ? getPlanConvertedIncludes(propertyTypes, usageTypesData, plan, convertToBaseUnit)
    : null;
  return plan.withMutations((itemWithMutations) => {
    itemWithMutations.set('rates', rates);
    if (isPrepaidPlan) {
      itemWithMutations.set('pp_threshold', ppThresholds);
      itemWithMutations.set('notifications_threshold', notificationsThresholds);
    } else {
      itemWithMutations.set('include', planIncludes);
    }
  });
};

const convertPrepaidGroup = (getState, prepaidGroup, convertToBaseUnit) => {
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const prepaidIncludes = state.list.get('pp_includes');
  const includes = getPlanConvertedPpIncludes(propertyTypes, usageTypesData, prepaidIncludes, prepaidGroup, convertToBaseUnit); // eslint-disable-line max-len
  return prepaidGroup.withMutations((itemWithMutations) => {
    itemWithMutations.set('include', includes);
  });
};

export const savePlan = (plan, action) => (dispatch, getState) => {
  const convertedPlan = convertPlan(getState, plan, true);
  return dispatch(saveEntity('plans', convertedPlan, action));
};

export const savePrepaidGroup = (prepaidGroup, action) => (dispatch, getState) => {
  const convertedPrepaidGroup = convertPrepaidGroup(getState, prepaidGroup, true);
  return dispatch(saveEntity('prepaidgroups', convertedPrepaidGroup, action));
};

export const getPlan = id => (dispatch, getState) => {
  dispatch(startProgressIndicator());
  const query = fetchPlanByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      const plan = Immutable.fromJS(item);
      const convertedPlan = convertPlan(getState, plan, false).toJS();
      dispatch(gotItem(convertedPlan));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving plan')));
};

export const getPrepaidGroup = id => (dispatch, getState) => {
  dispatch(startProgressIndicator());
  const query = fetchPrepaidGroupByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      const prepaidGroup = Immutable.fromJS(item);
      const convertedPrepaidGroup = convertPrepaidGroup(getState, prepaidGroup, false).toJS();
      dispatch(gotItem(convertedPrepaidGroup));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving prepaid group')));
};

export const getAllGroup = () => apiBillRun(getAllGroupsQuery());
