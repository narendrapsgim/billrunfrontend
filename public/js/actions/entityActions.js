import _ from 'lodash';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator} from './progressIndicatorActions';

export const actions = {
  GOT_ENTITY: 'GOT_ENTITY',
  UPDATE_ENTITY_FIELD: 'UPDATE_ENTITY_FIELD',
  CLEAR_ENTITY: 'CLEAR_ENTITY'
};

export function updateEntityField(collection, field_id, value) {
  return {
    type: actions.UPDATE_ENTITY_FIELD,
    collection,
    field_id,
    value
  };
}

export function gotEntity(collection, entity) {
  return {
    type: actions.GOT_ENTITY,
    collection,
    entity
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
