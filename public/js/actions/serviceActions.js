import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator } from './progressIndicatorActions';
import { saveEntity } from './entityActions';
import { fetchServiceByIdQuery } from '../common/ApiQueries';
import { getConfig } from '../common/Util';

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

export const addGroup = (groupName, usage, value, shared, products) => ({
  type: ADD_GROUP_SERVICE,
  groupName,
  usage,
  value,
  shared,
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

export const saveService = (service, action) => saveEntity('services', service, action);

export const getService = id => (dispatch) => {
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
      dispatch(gotItem(item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving Entity')));
};
