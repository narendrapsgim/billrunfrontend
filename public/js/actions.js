import aja from 'aja';

export const UPDATE_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const GOT_ITEM = 'GOT_COLLECTION_ITEMS';

export function updateFieldValue(field_id, field_value, page_name) {
  return {
    type: UPDATE_FIELD_VALUE,
    field_id,
    field_value,
    page_name
  };
}

function gotItem(item, page_name) {
  return {
    type: GOT_ITEM,
    item,
    page_name
  };
}

function fetchItem(collection, item_id) {
  return dispatch => {
    aja()
      .url(`http://billrun/api/${collection}?query={id: ${item_id}}`)
      .on('success', resp => {
        //        dispatch(gotItem(resp.details, collection));
        let item = {key: "Plan", rates: ["Rate 1", "Rate 2"], cost: 60};
        dispatch(gotItem(item, collection));
      })
      .go();
  };
}

export function getCollectionEntity(collection, entity_id) {
  return dispatch => {
    return dispatch(fetchItem(collection, entity_id));
  };
}
