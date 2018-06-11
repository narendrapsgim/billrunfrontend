export const SET_NAME = 'SET_NAME';
export const SET_DELIMITER_TYPE = 'SET_DELIMITER_TYPE';
export const UPDATE_INPUT_PROCESSOR_FIELD = 'UPDATE_INPUT_PROCESSOR_FIELD';
export const SET_DELIMITER = 'SET_DELIMITER';
export const SET_FIELDS = 'SET_HEADERS';
export const SET_FIELD_MAPPING = 'SET_FIELD_MAPPING';
export const ADD_CSV_FIELD = 'ADD_CSV_FIELD';
export const ADD_USAGET_MAPPING = 'ADD_USAGET_MAPPING';
export const SET_CUSTOMER_MAPPING = 'SET_CUSTOMER_MAPPING';
export const ADD_RATE_CATEGORY = 'ADD_RATE_CATEGORY';
export const REMOVE_RATE_CATEGORY = 'REMOVE_RATE_CATEGORY';
export const SET_RATING_FIELD = 'SET_RATING_FIELD';
export const ADD_RATING_FIELD = 'ADD_RATING_FIELD';
export const ADD_RATING_PRIORITY = 'ADD_RATING_PRIORITY';
export const REMOVE_RATING_PRIORITY = 'REMOVE_RATING_PRIORITY';
export const REMOVE_RATING_FIELD = 'REMOVE_RATING_FIELD';
export const SET_CUSETOMER_MAPPING = 'SET_CUSETOMER_MAPPING';
export const SET_PRICING_MAPPING = 'SET_PRICING_MAPPING';
export const ADD_CUSTOMER_MAPPING = 'ADD_CUSTOMER_MAPPING';
export const REMOVE_CUSTOMER_MAPPING = 'REMOVE_CUSTOMER_MAPPING';
export const SET_RECEIVER_FIELD = 'SET_RECEIVER_FIELD';
export const CANCEL_KEY_AUTH = 'CANCEL_KEY_AUTH';
export const GOT_PROCESSOR_SETTINGS = 'GOT_PROCESSOR_SETTINGS';
export const GOT_INPUT_PROCESSORS = 'GOT_INPUT_PROCESSORS';
export const SET_FIELD_WIDTH = 'SET_FIELD_WIDTH';
export const CLEAR_INPUT_PROCESSOR = 'CLEAR_INPUT_PROCESSOR';
export const MAP_USAGET = 'MAP_USAGET';
export const REMOVE_CSV_FIELD = 'REMOVE_CSV_FIELD';
export const REMOVE_USAGET_MAPPING = 'REMOVE_USAGET_MAPPING';
export const SET_USAGET_TYPE = 'SET_USAGET_TYPE';
export const SET_LINE_KEY = 'SET_LINE_KEY';
export const SET_COMPUTED_LINE_KEY = 'SET_COMPUTED_LINE_KEY';
export const UNSET_COMPUTED_LINE_KEY = 'UNSET_COMPUTED_LINE_KEY';
export const REMOVE_ALL_CSV_FIELDS = 'REMOVE_ALL_CSV_FIELDS';
export const SET_STATIC_USAGET = 'SET_STATIC_USAGET';
export const SET_INPUT_PROCESSOR_TEMPLATE = 'SET_INPUT_PROCESSOR_TEMPLATE';
export const MOVE_CSV_FIELD_UP = 'MOVE_CSV_FIELD_UP';
export const MOVE_CSV_FIELD_DOWN = 'MOVE_CSV_FIELD_DOWN';
export const CHANGE_CSV_FIELD = 'CHANGE_CSV_FIELD';
export const UNSET_FIELD = 'UNSET_FIELD';
export const SET_PARSER_SETTING = 'SET_PARSER_SETTING';
export const SET_PROCESSOR_TYPE = 'SET_PROCESSOR_TYPE';
export const SET_REALTIME_FIELD = 'SET_REALTIME_FIELD';
export const SET_REALTIME_DEFAULT_FIELD = 'SET_REALTIME_DEFAULT_FIELD';
export const SET_CHECKED_FIELD = 'SET_CHECKED_FIELD';
export const SET_FILTERED_FIELDS = 'SET_FILTERED_FIELDS';

import { showSuccess, showDanger } from './alertsActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator} from './progressIndicatorActions';
import {
  getInputProcessorActionQuery,
  setInputProcessorQuery,
} from '../common/ApiQueries';
import _ from 'lodash';
import Immutable from 'immutable';
import { getSettings } from './settingsActions';

const convert = (settings) => {
  const { parser = {},
          processor = {},
          customer_identification_fields = {},
          rate_calculators = {},
          pricing = {},
          receiver = {},
          realtime = {},
          response = {},
          unify = {},
          enabled = true,
          filters = []
        } = settings;

  const connections = receiver ? (receiver.connections ? receiver.connections[0] : {}) : {};
  const field_widths = (parser.type === "fixed" && parser.structure) ? parser.structure.map(struct => struct.width) : [];
  const usaget_type = (!_.result(processor, 'usaget_mapping') || processor.usaget_mapping.length < 1) ?
                      "static" :
                      "dynamic";

  const ret = {
    file_type: settings.file_type,
    delimiter_type: parser.type,
    delimiter: parser.separator,
    csv_has_header: parser.csv_has_header,
    csv_has_footer: parser.csv_has_footer,
    usaget_type,
    type: settings.type,
    unfiltered_fields: parser.structure ?
      Immutable.List(parser.structure).map(struct => Immutable.Map({ name: struct.name, checked: struct.checked ? struct.checked : true })) :
      Immutable.List(),
    field_widths,
    customer_identification_fields,
    rate_calculators,
    pricing,
    unify,
    enabled,
    filters
  };

  ret.fields = ret.unfiltered_fields.filter(field => field.get('checked') === true).map(field => Immutable.Map({ name: field.get('name') }));

  if (settings.type !== 'realtime') {
    ret.receiver = connections;
  } else {
    ret.realtime = realtime;
    ret.response = response;
  }

  if (processor) {
    let usaget_mapping;
    if (usaget_type === "dynamic") {
      usaget_mapping = processor.usaget_mapping.map(usaget => {
	return {
    src_field: usaget.src_field,
    conditions: usaget.conditions !== undefined ? usaget.conditions : [ {src_field: usaget.src_field, pattern: usaget.pattern} ],
	  usaget: usaget.usaget,
	  pattern: usaget.pattern,
    unit: usaget.unit,
    volume_type: usaget.volume_type,
    volume_src: usaget.volume_src,
	}
      })
    } else {
      usaget_mapping = [];
    }
    ret.processor = Object.assign({}, processor, {
      usaget_mapping,
      src_field: usaget_type === "dynamic" ? processor.usaget_mapping[0].src_field : ""
    });
    if (!rate_calculators) {
      if (usaget_type === 'dynamic') {
        ret.rate_calculators = _.reduce(processor.usaget_mapping, (acc, mapping) => {
	  acc['retail'][mapping.usaget] = [];
          return acc;
        }, {});
      } else {
	ret.rate_calculators = { retail: { [processor.default_usaget]: [] } };
      }
    }
    if (!customer_identification_fields) {
      if (usaget_type === 'dynamic') {
        ret.customer_identification_fields = _.reduce(processor.usaget_mapping, (acc, mapping) => {
          acc[mapping.usaget] = [];
          return acc;
        }, {});
      } else {
        ret.customer_identification_fields = { [processor.default_usaget]: [] };
      }
    }
    if (!pricing) {
      if (usaget_type === 'dynamic') {
        ret.pricing = _.reduce(processor.usaget_mapping, (acc, mapping) => {
          acc[mapping.usaget] = {};
          return acc;
        }, {});
      } else {
        ret.pricing = { [processor.default_usaget]: {} };
      }
    }

    for (var key in ret.pricing) {
      var obj = ret.pricing[key];
      if (obj.length === 0) {
        ret.pricing[key] = {};
      }
    }
  } else {
    ret.processor = {
      usaget_mapping: []
    };
  }
  return ret;
};

function gotProcessorSettings(settings) {
  return {
    type: GOT_PROCESSOR_SETTINGS,
    settings
  };
}

function fetchProcessorSettings(file_type) {
  const query = {
    api: "settings",
    params: [
      { category: "file_types" },
      { data: JSON.stringify({file_type}) }
    ]
  };
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      resp => {
        dispatch(finishProgressIndicator());
        dispatch(gotProcessorSettings(convert(resp.data[0].data.details)));
      }
    ).catch(error => {
      console.log(error);
      dispatch(finishProgressIndicator());
      dispatch(showDanger("Error loading input processor"));
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

export function updateInputProcessorField(fieldPath, value) {
  return {
    type: UPDATE_INPUT_PROCESSOR_FIELD,
    fieldPath,
    value,
  };
}

export function setProcessorType(processor_type) {
  return {
    type: SET_PROCESSOR_TYPE,
    processor_type
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

export function setFieldWidth(index, width) {
  return {
    type: SET_FIELD_WIDTH,
    index,
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

export function removeCSVField(index, field) {
  return {
    type: REMOVE_CSV_FIELD,
    index,
    field,
  };
}

export function removeAllCSVFields() {
  return {
    type: REMOVE_ALL_CSV_FIELDS
  };
}

function addedUsagetMapping(usaget) {
  return {
    type: ADD_USAGET_MAPPING,
    usaget
  };
}

export function removeUsagetMapping(index) {
  return {
    type: REMOVE_USAGET_MAPPING,
    index
  };
}

export function setStaticUsaget(usaget) {
  return {
    type: SET_STATIC_USAGET,
    usaget
  };
}

export function mapUsaget(mapping) {
  return {
    type: MAP_USAGET,
    mapping
  };
}

export function setCustomerMapping(field, mapping, usaget, index) {
  return {
    type: SET_CUSETOMER_MAPPING,
    field,
    mapping,
    usaget,
    index,
  };
}

export function setPricingMapping(field, mapping, usaget) {
  return {
    type: SET_PRICING_MAPPING,
    field,
    mapping,
    usaget,
  };
}

export function addCustomerMapping(usaget) {
  return {
    type: ADD_CUSTOMER_MAPPING,
    usaget,
  };
}

export function removeCustomerMapping(usaget, priority) {
  return {
    type: REMOVE_CUSTOMER_MAPPING,
    usaget,
    priority,
  };
}

export function addRateCategory(rateCategory) {
  return {
    type: ADD_RATE_CATEGORY,
    rateCategory,
  };
}

export function removeRateCategory(rateCategory) {
  return {
    type: REMOVE_RATE_CATEGORY,
    rateCategory,
  };
}

export function setRatingField(rateCategory, usaget, priority, index, rate_key, value) {
  return {
    type: SET_RATING_FIELD,
    rateCategory,
    usaget,
    priority,
    index,
    rate_key,
    value,
  };
}

export function addRatingField(rateCategory, usaget, priority) {
  return {
    type: ADD_RATING_FIELD,
    rateCategory,
    usaget,
    priority,
  };
}

export function addRatingPriorityField(rateCategory, usaget) {
  return {
    type: ADD_RATING_PRIORITY,
    rateCategory,
    usaget,
  };
}

export function removeRatingPriorityField(rateCategory, usaget, priority) {
  return {
    type: REMOVE_RATING_PRIORITY,
    rateCategory,
    usaget,
    priority,
  };
}

export function removeRatingField(rateCategory, usaget, priority, index) {
  return {
    type: REMOVE_RATING_FIELD,
    rateCategory,
    usaget,
    priority,
    index,
  };
}

export function setLineKey(rateCategory, usaget, priority, index, value) {
  return {
    type: SET_LINE_KEY,
    rateCategory,
    usaget,
    priority,
    index,
    value
  };
}

export function setComputedLineKey(paths, values) {
  return {
    type: SET_COMPUTED_LINE_KEY,
    paths,
    values,
  };
}

export function unsetComputedLineKey(rateCategory, usaget, priority, index) {
  return {
    type: UNSET_COMPUTED_LINE_KEY,
    rateCategory,
    usaget,
    priority,
    index,
  };
}

export function setReceiverField(field, mapping) {
  return {
    type: SET_RECEIVER_FIELD,
    field,
    mapping
  };
}


export function cancelKeyAuth(field) {
  return {
    type: CANCEL_KEY_AUTH,
    field,
  };
}


export function saveInputProcessorSettings(state, parts = []) {
  const action = (parts.length === 0) ? 'set' : 'validate';
  const processor = state.get('processor'),
        customer_identification_fields = state.get('customer_identification_fields'),
        unify = state.get('unify', Immutable.Map()),
        rate_calculators = state.get('rate_calculators'),
        pricing = state.get('pricing'),
        receiver = state.get('receiver'),
        realtime = state.get('realtime', Immutable.Map()),
        response = state.get('response', Immutable.Map()),
        enabled = state.get('enabled'),
        filters = state.get('filters');
  const settings = {
    file_type: state.get('file_type'),
    type: state.get('type'),
    parser: {
      type: state.get('delimiter_type'),
      separator: state.get('delimiter'),
      structure: state.get('unfiltered_fields').reduce((acc, field, idx) => {
        const struct = (state.get('delimiter_type') === 'fixed')
          ? Immutable.Map({ name: field.get('name'), checked: field.get('checked'), width: state.getIn(['field_widths', idx], '') })
          : Immutable.Map({ name: field.get('name'), checked: field.get('checked') });
        return acc.push(struct);
      }, Immutable.List()),
    },
  };

  if (state.get('delimiter') !== 'json') {
    settings.parser.csv_has_header = state.get('csv_has_header', false);
    settings.parser.csv_has_footer = state.get('csv_has_footer', false);
  }
  if (processor) {
    const processor_settings = state.get('usaget_type') === "static"
    ? {
      default_usaget: processor.get('default_usaget'),
      default_unit: processor.get('default_unit'),
      default_volume_type: processor.get('default_volume_type'),
      default_volume_src: processor.get('default_volume_src'),
    }
    : {
      usaget_mapping: processor.get('usaget_mapping').map(usaget => ({
        src_field: usaget.get('src_field'),
        conditions: usaget.get('conditions'),
        pattern: usaget.get('pattern'),
        usaget: usaget.get('usaget'),
        unit: usaget.get('unit'),
        volume_type: usaget.get('volume_type'),
        volume_src: usaget.get('volume_src'),
      })).toJS(),
    };
    settings.processor = {
      type: (settings.type === 'realtime' ? 'Realtime' : 'Usage'),
      "date_field": processor.get('date_field'),
      "volume_field": processor.get('volume_field'),
      "aprice_field": processor.get('aprice_field'),
      "aprice_mult": processor.get('aprice_mult'),
      ...processor_settings
    };
    if (processor.get('time_field', false)) settings.processor['time_field'] = processor.get('time_field');
    if (processor.get('date_format', false)) {
      settings.processor['date_format'] = processor.get('date_format');
    }
    if (processor.get('time_format', false)) {
      settings.processor['time_format'] = processor.get('time_format');
    }
    if (processor.get('timezone_field', false)) {
      settings.processor['timezone_field'] = processor.get('timezone_field');
    }
  }
  if (customer_identification_fields) {
    settings.customer_identification_fields = customer_identification_fields.toJS();
  }
  if (rate_calculators) {
    settings.rate_calculators = rate_calculators.toJS();
  }
  if (pricing) {
    settings.pricing = pricing.toJS();
  }
  if (unify) {
    settings.unify = unify.toJS();
  }
  settings.enabled = enabled !== undefined ? enabled : true;
  if (filters) {
    settings.filters = filters.toJS();
  }
  if (state.get('type') !== 'realtime' && receiver) {
    const receiverType = receiver.get('receiver_type', 'ftp');
    settings.receiver = {
      type: receiverType,
      connections: [
        receiver.toJS(),
      ],
    };
  }
  const defaultResponse = {
    encode: 'json',
    fields: [
      { response_field_name: 'requestNum', row_field_name: 'request_num' },
      { response_field_name: 'requestType', row_field_name: 'request_type' },
      { response_field_name: 'sessionId', row_field_name: 'session_id' },
      { response_field_name: 'returnCode', row_field_name: 'granted_return_code' },
      { response_field_name: 'sid', row_field_name: 'sid' },
      { response_field_name: 'grantedVolume', row_field_name: 'usagev' },
    ],
  };
  if (state.get('type') === 'realtime') {
    settings.realtime = realtime.toJS();
    settings.response = (response.size > 0 ? response.toJS() : defaultResponse);
  }

  let settingsToSave = {};
  if (action === 'set') {
    settingsToSave = settings;
  } else {
    parts.forEach((part) => { settingsToSave[part] = settings[part]; });
  }
  return (dispatch) => {
    dispatch(startProgressIndicator());
    const query = setInputProcessorQuery(settingsToSave, action);
    return apiBillRun(query)
      .then((success) => {
        dispatch(finishProgressIndicator());
        return success;
      })
      .catch((error) => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(error, 'Error saving input processor'));
        return false;
      });
  };
}

function gotInputProcessors(input_processors) {
  return {
    type: GOT_INPUT_PROCESSORS,
    input_processors
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

export const deleteInputProcessor = fileType => (dispatch) => {
  const query = getInputProcessorActionQuery(fileType, 'unset');
  dispatch(startProgressIndicator());
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error occured while trying to delete input processor')));
};

export const updateInputProcessorEnabled = (fileType, enabled) => (dispatch) => {
  const action = (enabled ? 'enable' : 'disable');
  const query = getInputProcessorActionQuery(fileType, action);
  dispatch(startProgressIndicator());
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success)))
    .catch(error => dispatch(apiBillRunErrorHandler(error, `Error occured while trying to ${action} input processor`)));
};

export function setUsagetType(usaget_type) {
  return {
    type: SET_USAGET_TYPE,
    usaget_type
  };
}

export function setInputProcessorTemplate(template) {
  const converted = convert(template);
  return {
    type: SET_INPUT_PROCESSOR_TEMPLATE,
    template: converted
  };
}


export function moveCSVFieldUp(index, field) {
  return {
    type: MOVE_CSV_FIELD_UP,
    index,
    field
  };
}

export function moveCSVFieldDown(index, field) {
  return {
    type: MOVE_CSV_FIELD_DOWN,
    index,
    field
  };
}

export function changeCSVField(index, value) {
  return {
    type: CHANGE_CSV_FIELD,
    index,
    value,
  };
}

export function unsetField(field_path = []) {
  const path = Array.isArray(field_path) ? field_path : [field_path];
  return {
    type: UNSET_FIELD,
    path
  };
}

export function setParserSetting(name, value) {
  return {
    type: SET_PARSER_SETTING,
    name,
    value
  };
}

export function setRealtimeField(name, value) {
  return {
    type: SET_REALTIME_FIELD,
    name,
    value
  };
}

export function setRealtimeDefaultField(name, value) {
  return {
    type: SET_REALTIME_DEFAULT_FIELD,
    name,
    value
  };
}

export function setCheckedField(index, checked, field) {
  return {
    type: SET_CHECKED_FIELD,
    index,
    checked,
    field,
  };
}

export function setFilteredFields(fields) {
  return {
    type: SET_FILTERED_FIELDS,
    fields,
  };
}
