import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

export const GOT_SERVICE = 'GOT_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const SAVE_SERVICE = 'SAVE_SERVICE';
export const CLEAR_SERVICE = 'CLEAR_SERVICE';
export const ADD_GROUP_SERVICE = 'ADD_GROUP_SERVICE';
export const REMOVE_GROUP_SERVICE = 'REMOVE_GROUP_SERVICE';

/* Helper */
function gotItem(item) {
  return {
    type: GOT_SERVICE,
    item,
  };
}

function apiFetchItem(id) {
  const query = {
    api: 'find',
    params: [
      { collection: 'services' },
      { size: 1 },
      { page: 0 },
      { query: JSON.stringify(
        { _id: { $in: [id] } }
      ) },
    ],
  };
  return apiBillRun(query);
}

function apiSaveItem(item, action) {
  const formData = new FormData();
  if (action === 'create') {
    const itemFrom = moment();
    const itemTo = moment().add(100, 'years');
    formData.append('update', JSON.stringify(item.set('from', itemFrom).set('to', itemTo)));
  } else if (action === 'update') {
    const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
    const update = item.delete('to').delete('from').delete('_id');
    formData.append('query', JSON.stringify(query));
    formData.append('update', JSON.stringify(update));
  }

  const query = {
    entity: 'services',
    action,
    options: {
      method: 'POST',
      body: formData,
    },
  };
  return apiBillRun(query);
}

/* Export */
export function clearItem() {
  return {
    type: CLEAR_SERVICE,
  };
}

export function updateItem(path, value) {
  return {
    type: UPDATE_SERVICE,
    path,
    value,
  };
}

export function getItem(id) {
  return (dispatch) => {
    dispatch(startProgressIndicator());
    return apiFetchItem(id).then(
      (response) => {
        if (response.data[0].data.details.length === 0) {
          throw response;
        }
        const item = response.data[0].data.details[0];
        if (typeof item.price === 'undefined' || !Array.isArray(item.price)) {
          item.price = [{
            from: 0,
            to: globalSetting.serviceCycleUnlimitedValue,
            price: typeof item.price === 'undefined' ? '' : item.price,
          }];
        }
        dispatch(gotItem(item));
        dispatch(finishProgressIndicator());
        return (true);
      }
    ).catch((error) => {
      dispatch(finishProgressIndicator());
      return (error);
    });
  };
}

export function saveItem(item) {
  const action = item.getIn(['_id', '$id'], null) ? 'update' : 'create';
  return (dispatch) => {
    dispatch(startProgressIndicator());
    return apiSaveItem(item, action).then(
      (success) => { // eslint-disable-line no-unused-vars
        dispatch(finishProgressIndicator());
        return (true);
      }
    ).catch((error) => {
      dispatch(apiBillRunErrorHandler(error));
      return (error);
    });
  };
}

export const onGroupAdd = (groupName, usage, value, shared, products) => ({
  type: ADD_GROUP_SERVICE,
  groupName,
  usage,
  value,
  shared,
  products,
});

export const onGroupRemove = groupName => ({
  type: REMOVE_GROUP_SERVICE,
  groupName,
});
