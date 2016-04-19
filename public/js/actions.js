import aja from 'aja';

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

function gotItem(item, page_name) {
  return {
    type: GOT_ITEM,
    item,
    page_name
  };
}

function fetchItem(collection, item_id) {
  let item = {
    "_id" : "56debc51563cb7121d8b457a",
    "name" : "REG_BONUS_18",
    "external_id" : "REG_BONUS_18",
    "service_provider" : "Pelephone",
    "customer_plan" : "שאר המסלולים",
    "type" : "charging",
    "from" : "2015-11-30T22:00:00Z",
    "to" : "2099-12-30T22:00:00Z",
    "operation" : "set",
    "include" : {
      "cost" : [
        {
	  "value" : -15,
	  "period" : {
	    "unit" : "month",
	    "duration" : 1
	  },
	  "pp_includes_name" : "Monthly Bonus",
	  "pp_includes_external_id" : "9"
	},
        {
	  "value" : -15,
	  "period" : {
	    "unit" : "month",
	    "duration" : 1
	  },
	  "pp_includes_name" : "Monthly Bonus",
	  "pp_includes_external_id" : "9"
	}
      ]
    },
    "priority" : 99999,
    "recurring" : 1
  };

  return dispatch => {
    aja()
      .url(`http://billrun/api/${collection}?query={id: ${item_id}}`)
           .on('success', resp => {
             //dispatch(gotItem(resp.details, collection));
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
