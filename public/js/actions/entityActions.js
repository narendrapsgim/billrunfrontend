import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getEntityByIdQuery, apiEntityQuery } from '../common/ApiQueries';
import { getItemDateValue } from '../common/Util';
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
      const newFrom = getItemDateValue(item, 'from').format(globalSetting.apiDateTimeFormat);
      const update = item.withMutations((itemwithMutations) => {
        itemwithMutations
          .set('from', newFrom)
          .delete('originalValue');
      });
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'update': {
      const formData = new FormData();
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      const update = item.withMutations((itemwithMutations) => {
        itemwithMutations
          .delete('_id')
          .delete('originalValue');
      });
      formData.append('query', JSON.stringify(query));
      formData.append('update', JSON.stringify(update));
      return formData;
    }

    case 'closeandnew': {
      const formData = new FormData();
      const update = item.withMutations((itemwithMutations) => {
        const originalFrom = getItemDateValue(item, 'originalValue', null);
        if (originalFrom !== null) {
          if (originalFrom.isSame(getItemDateValue(item, 'from', moment(0)), 'days')) {
            itemwithMutations.delete('from');
          }
        }
        itemwithMutations
          .delete('_id')
          .delete('originalValue');
      });
      formData.append('update', JSON.stringify(update));
      const query = { _id: item.getIn(['_id', '$id'], 'undefined') };
      formData.append('query', JSON.stringify(query));
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
