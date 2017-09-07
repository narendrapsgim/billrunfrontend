import Immutable from 'immutable';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator } from './progressIndicatorActions';
import { saveEntity } from './entityActions';
import { fetchServiceByIdQuery } from '../common/ApiQueries';
import {
  getPlanConvertedIncludes,
  convertServiceBalancePeriodToObject,
  convertServiceBalancePeriodToString,
} from '../common/Util';
import {
  usageTypesDataSelector,
  propertyTypeSelector,
} from '../selectors/settingsSelector';

export const GOT_SERVICE = 'GOT_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const SAVE_SERVICE = 'SAVE_SERVICE';
export const CLEAR_SERVICE = 'CLEAR_SERVICE';
export const CLONE_RESET_SERVICE = 'CLONE_RESET_SERVICE';
export const ADD_GROUP_SERVICE = 'ADD_GROUP_SERVICE';
export const REMOVE_GROUP_SERVICE = 'REMOVE_GROUP_SERVICE';


const gotItem = item => ({
  type: GOT_SERVICE,
  item,
});

export const clearService = () => ({
  type: CLEAR_SERVICE,
});

export const updateService = (path, value) => ({
  type: UPDATE_SERVICE,
  path,
  value,
});

export const addGroup = (groupName, usage, unit, value, shared, pooled, products) => ({
  type: ADD_GROUP_SERVICE,
  groupName,
  usage,
  unit,
  value,
  shared,
  pooled,
  products,
});

export const removeGroup = groupName => ({
  type: REMOVE_GROUP_SERVICE,
  groupName,
});

export const setCloneService = () => ({
  type: CLONE_RESET_SERVICE,
  uniquefields: ['name'],
});

const convertService = (getState, service, convertToBaseUnit, toSend) => {
  const state = getState();
  const usageTypesData = usageTypesDataSelector(state);
  const propertyTypes = propertyTypeSelector(state);
  const serviceIncludes = getPlanConvertedIncludes(propertyTypes, usageTypesData, service, convertToBaseUnit); // eslint-disable-line max-len
  return service.withMutations((itemWithMutations) => {
    if (!serviceIncludes.isEmpty()) {
      itemWithMutations.set('include', serviceIncludes);
    }
    if (toSend) { // convert item before send to server
      if (itemWithMutations.getIn(['balance_period', 'type'], '') === 'custom_period') {
        itemWithMutations.setIn(['price', 0, 'to'], 0);
        itemWithMutations.set('quantitative', false);
        itemWithMutations.set('prorated', false);
      }
      const balancePeriod = convertServiceBalancePeriodToString(itemWithMutations);
      itemWithMutations.set('balance_period', balancePeriod);
    } else { // convert item resived from server
      const balancePeriod = convertServiceBalancePeriodToObject(itemWithMutations);
      itemWithMutations.set('balance_period', balancePeriod);
    }
  });
};

export const saveService = (service, action) => (dispatch, getState) => {
  const convertedService = convertService(getState, service, true, true);
  return dispatch(saveEntity('services', convertedService, action));
};

export const getService = id => (dispatch, getState) => {
  dispatch(startProgressIndicator());
  const query = fetchServiceByIdQuery(id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      // for back capability
      if (typeof item.price === 'undefined' || !Array.isArray(item.price)) {
        item.price = [{
          from: 0,
          to: globalSetting.serviceCycleUnlimitedValue,
          price: typeof item.price === 'undefined' ? '' : item.price,
        }];
      }
      item.originalValue = item.from;
      const service = Immutable.fromJS(item);
      const convertedService = convertService(getState, service, false, false).toJS();
      dispatch(gotItem(convertedService));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving Entity')));
};
