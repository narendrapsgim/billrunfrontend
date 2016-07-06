export const SET_DELIMITER = 'SET_DELIMITER';
export const SET_FIELDS = 'SET_HEADERS';
export const SET_FIELD_MAPPING = 'SET_FIELD_MAPPING';
export const ADD_CSV_FIELD = 'ADD_CSV_FIELD';
export const ADD_USAGET_MAPPING = 'ADD_USAGET_MAPPING';
export const SET_CUSTOMER_MAPPING = 'SET_CUSTOMER_MAPPING';
export const SET_RATING_FIELD = 'SET_RATING_FIELD';
export const SET_CUSETOMER_MAPPING = 'SET_CUSETOMER_MAPPING';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function setDelimiter(delimiter) {
  return {
    type: SET_DELIMITER,
    delimiter
  };
}

export function setFields(fields) {
  return {
    type: SET_FIELDS,
    fields
  };
}

export function setFieldMapping(field, mapping) {
  return {
    type: SET_FIELD_MAPPING,
    field,
    mapping
  };
}

export function addCSVField(field) {
  return {
    type: ADD_CSV_FIELD,
    field
  };
}

export function addUsagetMapping(mapping) {
  return {
    type: ADD_USAGET_MAPPING,
    mapping
  };
}

export function setCustomerMapping(field, mapping) {
  return {
    type: SET_CUSETOMER_MAPPING,
    field,
    mapping
  };
}

export function setRatingField(usaget, rate_key, value) {
  return {
    type: SET_RATING_FIELD,
    usaget,
    rate_key,
    value
  };
}

export function saveInputProcessorSettings(state) {
  const processor = state.get('processor'),
        customer_identification_fields = state.get('customer_identification_fields'),
        rate_calculators = state.get('rate_calculators');

  let settings = {
    "file_type": "csv_separated",
    "parser": {
      "type": "separator",
      "separator": state.get('delimiter'),
      "structure": state.get('fields')
    },
    "processor": {
      "type": "Usage",
      "date_field": processor.get('time'),
      "volume_field": processor.get('volume_field'),
      "usaget_mapping": processor.get('usaget_mapping').map(usaget => {
        return {
          "src_field": processor.get('src_field'),
          "pattern": `/^${usaget.get('pattern')}$/`,
          "usaget": usaget.get('usaget')
        }
      })
    },
    "customer_identification_fields": customer_identification_fields.toJS(),
    "rate_calculators": rate_calculators.toJS()
  };

  let setUrl = `/api/settings?category=file_types&action=set&data=${JSON.stringify(settings)}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };  
}

