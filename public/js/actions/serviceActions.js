export const GOT_SERVICE = 'GOT_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const SAVE_SERVICE = 'SAVE_SERVICE';
export const CLEAR_SERVICE = 'CLEAR_SERVICE';

import moment from 'moment';
import { apiBillRun } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

/* Helper */
function gotItem(item) {
  return {
    type: GOT_SERVICE,
    item
  };
}

function apiFetchItem(id){
  const query = {
    api: 'find',
    params: [
      { collection: 'services' },
      { size: '1' },
      { page: '0' },
      { query: JSON.stringify(
        {'_id' :  {'$in': [id]}}
      )},
    ]
  };
  return apiBillRun(query);
}

function apiSaveItem(item, action){

  const formData = new FormData();
  formData.append('method', action);

  if(action === 'create'){
    let itemFrom = moment(); //.format(globalSetting.apiDateTimeFormat)
    let itemTo = moment().add(100, 'years'); //.format(globalSetting.apiDateTimeFormat)
    item = item.set('from', itemFrom).set('to', itemTo);
    formData.append('query', JSON.stringify(item));
  }

  else if(action === 'update'){
    let query = {'_id': item.getIn(['_id', '$id'], 'undefined')};
    formData.append('query', JSON.stringify(query));

    item = item.delete('to').delete('from').delete('_id');
    formData.append('update', JSON.stringify(item));
  }

  const query = {
    api: 'services',
    options: {
      method: 'POST',
      body: formData
    },
  };

  console.log('Save item : ', item.toJS());
  return apiBillRun(query);
}

/* Export */
export function clearItem() {
  return {
    type: CLEAR_SERVICE
  };
}

export function updateItem(path, value) {
  return {
    type: UPDATE_SERVICE,
    path,
    value
  };
}

export function getItem(id) {
  return dispatch => {
    dispatch(startProgressIndicator());
    return apiFetchItem(id).then(
      response => {
        if(response.data[0].data.details.length === 0){
          throw response;
        }
        let item = _.values(response.data[0].data.details)[0];
        dispatch(gotItem(item));
        dispatch(finishProgressIndicator());
        return (true);
      }
    ).catch(error => {
      dispatch(finishProgressIndicator());
      return (error);
    });
  };
}

export function saveItem(item) {
  const action = item.getIn(['_id','$id'], null) ? 'update' : 'create' ;
  return dispatch => {
    dispatch(startProgressIndicator());
    return apiSaveItem(item, action).then(
      success => {
        dispatch(finishProgressIndicator());
        return (true);
      }
    ).catch(error => {
      dispatch(finishProgressIndicator());
      return (error);
    });
  };
}
