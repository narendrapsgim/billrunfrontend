import aja from 'aja';
import globalSetting from './globalSetting';

export const UPDATE_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const GOT_ITEM = 'GOT_COLLECTION_ITEMS';
export const SAVE_FORM = 'SAVE_FORM';
export const SET_INITIAL_ITEM = 'SET_INITIAL_ITEM';

export function setInitialItem(page_name) {
  return {
    type: SET_INITIAL_ITEM,
    page_name
  };
}

export function saveForm(page_name) {
  return {
    type: SAVE_FORM,
    page_name
  };
}

export function updateFieldValue(path, field_value, page_name) {
  return {
    type: UPDATE_FIELD_VALUE,
    path,
    field_value,
    page_name
  };
}

function gotItem(item, collection, page_name) {
  return {
    type: GOT_ITEM,
    item,
    page_name,
    collection
  };
}

function fetchItem(item_id, collection, page_name) {
  return dispatch => {
    let queryString = `/api/${collection}?query={"_id":["${item_id}"]}`;
    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '&XDEBUG_SESSION_START=netbeans-xdebug';
    }
    aja()
      .url(globalSetting.serverUrl + queryString)
      .on('success', resp => {
        dispatch(gotItem(resp.details[0], collection, page_name));
      })
      .go();
  };
}

export function getCollectionEntity(entity_id, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItem(entity_id, collection, page_name));
  };
}
