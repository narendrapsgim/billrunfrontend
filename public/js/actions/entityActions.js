import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getEntityByIdQuery, apiEntityQuery } from '../common/ApiQueries';
import { getZiroTimeDate } from '../common/Util';
import { startProgressIndicator } from './progressIndicatorActions';

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

const buildRequestData = (item, action) => {
  switch (action) {

    case 'delete': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      return formData;
    }

    case 'create': {
      const formData = new FormData();
      // If from-date is string -> date was changed from UI and UI need to send it
      // it use for future entity creation
      if (typeof item.get('from', null) === 'string') {
        const newFrom = getZiroTimeDate(item.get('from', null)).toISOString();
        const update = item.set('from', newFrom);
        formData.append('update', JSON.stringify(update));
        return formData;
      }
      formData.append('update', JSON.stringify(item));
      return formData;
    }

    case 'update': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      const update = item.delete('_id');
      formData.append('query', JSON.stringify(query));
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'closeandnew': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      // If from-date is string -> date was changed from UI and UI need to send it
      // it use for future entity creation
      if (typeof item.get('from', null) === 'string') {
        const newFrom = getZiroTimeDate(item.get('from', null)).toISOString();
        const update = item.delete('_id').set('from', newFrom);
        formData.append('update', JSON.stringify(update));
      } else {
        const update = item.delete('_id').delete('from');
        formData.append('update', JSON.stringify(update));
      }
      return formData;
    }

    default:
      return new FormData();
  }
};

const requestDataBuilder = (collection, item, action) => {
  switch (collection) {
    default:
      return buildRequestData(item, action);
  }
};

export const saveEntity = (collection, item, action) => (dispatch) => {
  dispatch(startProgressIndicator());
  const body = requestDataBuilder(collection, item, action);
  const query = apiEntityQuery(collection, action, body);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error saving Entity')));
};

const fetchEntity = (collection, query) => (dispatch) => {
  dispatch(startProgressIndicator());
  return apiBillRun(query)
    .then((success) => {
      dispatch(gotEntity(collection, success.data[0].data.details[0]));
      return dispatch(apiBillRunSuccessHandler(success));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving Entity')));
};

export const getEntity = (collection, query) => dispatch =>
  dispatch(fetchEntity(collection, query));

export const getEntityById = (name, collection, id) => (dispatch) => {
  const query = getEntityByIdQuery(collection, id);
  return dispatch(fetchEntity(name, query));
};

export const deleteEntity = (collection, item) => dispatch =>
  dispatch(saveEntity(collection, item, 'delete'));
