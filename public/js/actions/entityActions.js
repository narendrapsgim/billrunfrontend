import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_ENTITY: 'GOT_ENTITY',
  UPDATE_ENTITY_FIELD: 'UPDATE_ENTITY_FIELD',
  DELETE_ENTITY_FIELD: 'DELETE_ENTITY_FIELD',
  CLEAR_ENTITY: 'CLEAR_ENTITY',
};

export const updateEntityField = (collection, path, value) => ({
  type: actions.UPDATE_ENTITY_FIELD,
  collection,
  path,
  value,
});

export const deleteEntityField = (collection, path) => ({
  type: actions.DELETE_ENTITY_FIELD,
  collection,
  path,
});

export const gotEntity = (collection, entity) => ({
  type: actions.GOT_ENTITY,
  collection,
  entity,
});

export const clearEntity = collection => ({
  type: actions.CLEAR_ENTITY,
  collection,
});

const buildUserRequestData = (item, action) => {
  const formData = new FormData();
  if (action === 'create') {
    formData.append('update', JSON.stringify(item));
  } else if (action === 'update') {
    const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
    const update = item.delete('_id');
    formData.append('query', JSON.stringify(query));
    formData.append('update', JSON.stringify(update));
  }
  return formData;
};

const requestDataBuilder = (collection, item, action) => {
  switch (collection) {
    case 'users':
      return buildUserRequestData(item, action);
    default:
      return new FormData();
  }
};

const apiSaveEntity = (collection, item, action) => {
  const body = requestDataBuilder(collection, item, action);
  const query = {
    entity: collection,
    action,
    options: {
      method: 'POST',
      body,
    },
  };
  return apiBillRun(query);
};

export const saveEntity = (collection, action = '') => (dispatch, getState) => {
  dispatch(startProgressIndicator());
  const { entity } = getState();
  const item = entity.get(collection);
  let saveAction;
  if (action.length > 0) {
    saveAction = action;
  } else {
    saveAction = item.getIn(['_id', '$id'], '').length > 0 ? 'update' : 'create';
  }
  return apiSaveEntity(collection, item, saveAction)
    .then((success) => { // eslint-disable-line no-unused-vars
      dispatch(finishProgressIndicator());
      return (true);
    })
    .catch((error) => {
      dispatch(finishProgressIndicator());
      return (error);
    });
};

const fetchEntity = (collection, query) => (dispatch) => {
  dispatch(startProgressIndicator());
  apiBillRun(query)
    .then((success) => {
      try {
        dispatch(finishProgressIndicator());
        dispatch(gotEntity(collection, success.data[0].data.details[0]));
      } catch (e) {
        throw new Error('Error retreiving Entity');
      }
    })
    .catch((error) => { dispatch(apiBillRunErrorHandler(error)); });
};

export const getEntity = (collection, query) => dispatch =>
  dispatch(fetchEntity(collection, query));
