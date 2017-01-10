import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_ENTITY: 'GOT_ENTITY',
  UPDATE_ENTITY_FIELD: 'UPDATE_ENTITY_FIELD',
  DELETE_ENTITY_FIELD: 'DELETE_ENTITY_FIELD',
  CLEAR_ENTITY: 'CLEAR_ENTITY'
};

export function updateEntityField(collection, path, value) {
  return {
    type: actions.UPDATE_ENTITY_FIELD,
    collection,
    path,
    value
  };
}

export function deleteEntityField(collection, path) {
  return {
    type: actions.DELETE_ENTITY_FIELD,
    collection,
    path,
  };
}

export function gotEntity(collection, entity) {
  return {
    type: actions.GOT_ENTITY,
    collection,
    entity
  };
}

function buildUserRequestData(item, action) {
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
}

function requestDataBuilder(collection, item, action) {
  switch (collection) {
    case 'user': return buildUserRequestData(item, action);
    default: return new FormData();
  }
}

function apiSaveEntity(collection, item, action) {
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
}

export function saveEntity(collection, action = '') {
  return (dispatch, getState) => {
    dispatch(startProgressIndicator());
    const { entity } = getState();
    const item = entity.get(collection);
    let saveAction;
    if (action.length > 0) {
      saveAction = action;
    } else {
      saveAction = item.getIn(['_id', '$id'], null) ? 'update' : 'create';
    }
    return apiSaveEntity(collection, item, saveAction).then(
      (success) => { // eslint-disable-line no-unused-vars
        dispatch(finishProgressIndicator());
        return (true);
      }
    ).catch((error) => {
      dispatch(finishProgressIndicator());
      return (error);
    });
  };
}

function fetchEntity(collection, query) {
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(finishProgressIndicator());
        const entity = success.data[0].data.details[0];
        dispatch(gotEntity(collection, entity));
      },
      failure => {
        dispatch(finishProgressIndicator());
        console.log(failure);
      }
    ).catch(
      error => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(error));
      }
    );
  };
}

export function getEntity(collection, query) {
  return dispatch => {
    return dispatch(fetchEntity(collection, query));
  };
}

export function clearEntity(collection) {
  return {
    type: actions.CLEAR_ENTITY,
    collection
  };
}
