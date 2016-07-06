export const SET_DELIMITER = 'SET_DELIMITER';
export const SET_FIELDS = 'SET_HEADERS';
export const SET_FIELD_MAPPING = 'SET_FIELD_MAPPING';
export const ADD_CSV_FIELD = 'ADD_CSV_FIELD';
export const ADD_USAGET_MAPPING = 'ADD_USAGET_MAPPING';
export const SET_CUSTOMER_MAPPING = 'SET_CUSTOMER_MAPPING';
export const SET_RATING_FIELD = 'SET_RATING_FIELD';
export const SET_CUSETOMER_MAPPING = 'SET_CUSETOMER_MAPPING';
export const SET_RECEIVER_FIELD = 'SET_RECEIVER_FIELD';
export const GOT_PROCESSOR_SETTINGS = 'GOT_PROCESSOR_SETTINGS';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotProcessorSettings(settings) {
  return {
    type: GOT_PROCESSOR_SETTINGS,
    settings
  };
}

function fetchProcessorSettings() {
  const convert = (settings) => {
    const { parser, processor,
            customer_identification_fields,
            rate_calculators,
            receiver } = settings;

    return {
      delimiter: parser.separator,
      fields: parser.structure,
      customer_identification_fields,
      processor,
      rate_calculators,
      receiver
    };
  };

  let fetchUrl = `/api/settings?category=file_types&data={"file_type":"csv_separated"}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotProcessorSettings(convert(resp.data.details)));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}

export function getProcessorSettings() {
  return (dispatch) => {
    return dispatch(fetchProcessorSettings());
  };
}

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

export function setReceiverField(field, mapping) {
  return {
    type: SET_RECEIVER_FIELD,
    field,
    mapping
  };
}

export function saveInputProcessorSettings(state) {
  const processor = state.get('processor'),
        customer_identification_fields = state.get('customer_identification_fields'),
        rate_calculators = state.get('rate_calculators'),
        receiver = state.get('receiver');

  let settings = {
    "file_type": "csv_separated",
    "parser": {
      "type": "separator",
      "separator": state.get('delimiter'),
      "structure": state.get('fields')
    },
    "processor": {
      "type": "Usage",
      "date_field": processor.get('date_field'),
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
    "rate_calculators": rate_calculators.toJS(),
    "receiver": receiver.toJS()
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

