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

  let item = {
    "_id" : "571ef62b9144dbb2de3ee4ee",
    "key" : "NUMEROS_SPECIAUX_T32_FIX",
    "type" : "regular",
    "params" : {
      "customer_segment" : [
	"GP",
	"Entreprise",
	"Interne"
      ],
      "destination" : [
	{
	  "prefix" : [
	    "3364165",
	    "3364994",
	    "3364996",
	    "3364997",
	    "3365701",
	    "3365702",
	    "3365703",
	    "3365704",
	    "3365710",
	    "3365790",
	    "3365794",
	    "37764165",
	    "37764994",
	    "37764996",
	    "37764997",
	    "37765701",
	    "37765702",
	    "37765703",
	    "37765704",
	    "37765710",
	    "37765790",
	    "37765794",
	    "377836601",
	    "377836602",
	    "377836605",
	    "377836606"
	  ],
	  "region" : "France_Radiomessagerie_2"
	}
      ],
      "source_types" : [
	"voip"
      ]
    },
    "country" : [
      "Monaco"
    ],
    "alpha3" : [
      "MCO"
    ],
    "rates" : {
      "call" : {
	"access" : 0.188,
	"rate" : [
	  {
	    "price" : 0.094,
	    "to" : 2147483647,
	    "interval" : 20
	  }
	],
	"currency" : "EURO",
	"unit" : "Duree",
	"erp_account" : "706114_DFXCNUM"
      }
    },
    "zone" : "Numeros Speciaux T32",
    "invoice_labels" : {
      "call" : "Numéros spéciaux"
    },
    "zone_grouping" : "Num__ros_sp__ciaux",
    "from" : "2015-09-30T22:00:00Z",
    "to" : "2113-12-31T22:00:00Z"
  };

  return dispatch => {
    let queryString = `/api/${collection}?query={"_id":["${item_id}"]}`;
    if(globalSetting.serverApiDebug && globalSetting.serverApiDebug == true){
        queryString += '&XDEBUG_SESSION_START=netbeans-xdebug';
    }
    aja()
      .url(globalSetting.serverUrl + queryString)
      .on('success', resp => {
        dispatch(gotItem(item, collection, page_name));//resp.details[0], collection, page_name));
      })
      .go();
  };
}

export function getCollectionEntity(entity_id, collection, page_name) {
  return dispatch => {
    return dispatch(fetchItem(entity_id, collection, page_name));
  };
}
