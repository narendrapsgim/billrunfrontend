export const SET_NAME = 'SET_NAME';
export const SET_DELIMITER_TYPE = 'SET_DELIMITER_TYPE';
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
export const GOT_INPUT_PROCESSORS = 'GOT_INPUT_PROCESSORS';
export const SET_FIELD_WIDTH = 'SET_FIELD_WIDTH';
export const CLEAR_INPUT_PROCESSOR = 'CLEAR_INPUT_PROCESSOR';
export const MAP_USAGET = 'MAP_USAGET';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showModal } from './modalActions';
import { showStatusMessage } from '../actions';

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

function fetchProcessorSettings(file_type) {
  const convert = (settings) => {
    if (!settings)
      return {
        file_type: '',
        delimiter_type: '',
        delimiter: '',
        fields: [],
        processor: {
          usaget_mapping: [],
          src_field: ''
        },
        customer_identification_fields: [],
        rate_calculators: {},
        receiver: {
          type: "ftp",
          connections: []
        }
      };
    
    const { parser, processor,
            customer_identification_fields,
            rate_calculators,
            receiver } = settings;

    const connections = receiver ? (receiver.connections ? receiver.connections[0] : {}) : {};

    return {
      file_type: settings.file_type,
      delimiter_type: parser.type,
      delimiter: parser.separator,
      fields: parser.structure,
      processor: Object.assign({}, processor, {
        usaget_mapping: processor.usaget_mapping.map(usaget => {
          return {
            usaget: usaget.usaget,
            pattern: usaget.pattern.replace("/^", "").replace("$/", "")
          }
        }),
        src_field: processor.usaget_mapping[0].src_field
      }),
      customer_identification_fields,
      rate_calculators,
      receiver: connections
    };
  };

  let fetchUrl = `/api/settings?category=file_types&data={"file_type":"${file_type}"}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotProcessorSettings(convert(resp.data.details)));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}

export function getProcessorSettings(file_type) {
  return (dispatch) => {
    return dispatch(fetchProcessorSettings(file_type));
  };
}

export function setName(file_type) {
  return {
    type: SET_NAME,
    file_type
  };
}

export function setDelimiterType(delimiter_type) {
  return {
    type: SET_DELIMITER_TYPE,
    delimiter_type
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

export function setFieldWidth(field, width) {
  return {
    type: SET_FIELD_WIDTH,
    field,
    width
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

export function addUsagetMapping(usaget) {
  let setUrl = `/api/settings?category=usage_types&action=set&data=[${JSON.stringify(usaget)}]`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        if (!resp.data.status) {
          dispatch(showModal(resp.data.desc, "Error!"));
        } else {
          //dispatch(showStatusMessage("Saved usaget sucessfully!", 'success'));
          return {
            type: ADD_USAGET_MAPPING,
            usaget
          };
        }
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}

export function mapUsaget(mapping) {
  return {
    type: MAP_USAGET,
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

export function saveInputProcessorSettings(state, part=false) {
  const processor = state.get('processor'),
        customer_identification_fields = state.get('customer_identification_fields'),
        rate_calculators = state.get('rate_calculators'),
        receiver = state.get('receiver');

  const settings = {
    "file_type": state.get('file_type'),
    "parser": {
      "type": state.get('delimiter_type'),
      "separator": state.get('delimiter'),
      "structure": state.get('delimiter_type') === "fixed" ? state.get('field_widths') : state.get('fields')
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
    "receiver": {
      "type": "ftp",
      "connections": [
        receiver.toJS()
      ]
    }
  };

  const settingsToSave = part ? {file_type: state.get('file_type'), [part]: {...settings[part]}} : settings;
  const setUrl = `/api/settings?category=file_types&action=set&data=${JSON.stringify(settingsToSave)}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        if (!resp.data.status) {
          dispatch(showModal(resp.data.desc, "Error!"));
        } else {
          dispatch(showStatusMessage("Saved input processor sucessfully!", 'success'));
        }
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };  
}

function gotInputProcessors(input_processors) {
  return {
    type: GOT_INPUT_PROCESSORS,
    input_processors
  };
}

function fetchInputProcessors() {
  let setUrl = '/api/settings?category=file_types&data={}';
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(setUrl).then(
      resp => {
        dispatch(gotInputProcessors(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}

export function getInputProcessors() {
  return (dispatch) => {
    return dispatch(fetchInputProcessors());
  };
}

export function newInputProcessor() {
  return {
    type: 'NEW_PROCESSOR'    
  };
}

export function clearInputProcessor() {
  return {
    type: CLEAR_INPUT_PROCESSOR
  };
}
