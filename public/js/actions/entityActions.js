import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getEntityByIdQuery, apiEntityQuery } from '../common/ApiQueries';
import { getItemDateValue, getConfig } from '../common/Util';
import { startProgressIndicator } from './progressIndicatorActions';

export const actions = {
  GOT_ENTITY: 'GOT_ENTITY',
  UPDATE_ENTITY_FIELD: 'UPDATE_ENTITY_FIELD',
  DELETE_ENTITY_FIELD: 'DELETE_ENTITY_FIELD',
  CLEAR_ENTITY: 'CLEAR_ENTITY',
  CLONE_RESET_ENTITY: 'CLONE_RESET_ENTITY',
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

export const setCloneEntity = (collection, entityName) => ({
  type: actions.CLONE_RESET_ENTITY,
  collection,
  uniquefields: getConfig(['systemItems', entityName, 'uniqueField'], []),
});

export const clearEntity = collection => ({
  type: actions.CLEAR_ENTITY,
  collection,
});

const buildRequestData = (item, action) => {
  switch (action) {

    case 'close': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      const update = { to: getItemDateValue(item, 'to').format(globalSetting.apiDateTimeFormat) };
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'delete': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      return formData;
    }

    case 'create': {
      const formData = new FormData();
      const newFrom = getItemDateValue(item, 'from').format(globalSetting.apiDateTimeFormat);
      const update = item.set('from', newFrom);
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'update': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      const update = item.delete('_id').delete('originalValue');
      formData.append('query', JSON.stringify(query));
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'closeandnew': {
      const formData = new FormData();

      // Temp Fix
      if (getItemDateValue(item, 'from').isBefore(moment()) || getItemDateValue(item, 'from').isSame(moment())) {
        const update = item.delete('_id').set('from', moment().toISOString()).delete('originalValue');
        formData.append('update', JSON.stringify(update));
      } else {
        const newFrom = getItemDateValue(item, 'from').format(globalSetting.apiDateTimeFormat);
        const update = item.delete('_id').set('from', newFrom).delete('originalValue');
        formData.append('update', JSON.stringify(update));
      }

      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
      return formData;
    }

    default:
      return new FormData();
  }
};

const requestActionBuilder = (collection, item, action) => {
  if (action === 'closeandnew' && getItemDateValue(item, 'from').isSame(getItemDateValue(item, 'originalValue', moment(0)), 'day')) {
    return 'update';
  }
  if (action === 'clone') {
    return 'create';
  }
  return action;
};

const requestDataBuilder = (collection, item, action) => {
  switch (collection) {
    default:
      return buildRequestData(item, action);
  }
};

export const saveEntity = (collection, item, action) => (dispatch) => {
  dispatch(startProgressIndicator());
  const apiAction = requestActionBuilder(collection, item, action);
  const body = requestDataBuilder(collection, item, apiAction);
  const query = apiEntityQuery(collection, apiAction, body);
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

export const closeEntity = (collection, item) => dispatch =>
  dispatch(saveEntity(collection, item, 'close'));
