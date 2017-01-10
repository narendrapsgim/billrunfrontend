import Immutable from 'immutable';

import { SET_NAME,
         SET_PARSER_SETTING,
         SET_PROCESSOR_TYPE,
         SET_DELIMITER_TYPE,
         GOT_PROCESSOR_SETTINGS,
         SET_FIELDS,
         SET_DELIMITER,
         SET_FIELD_MAPPING,
         REMOVE_CSV_FIELD,
         REMOVE_ALL_CSV_FIELDS,
         ADD_CSV_FIELD,
         MAP_USAGET,
         SET_CUSETOMER_MAPPING,
         SET_RATING_FIELD,
         SET_RECEIVER_FIELD,
         SET_FIELD_WIDTH,
         CLEAR_INPUT_PROCESSOR,
         REMOVE_USAGET_MAPPING,
         SET_USAGET_TYPE,
         SET_STATIC_USAGET,
         SET_LINE_KEY,
         SET_INPUT_PROCESSOR_TEMPLATE,
         MOVE_CSV_FIELD_DOWN,
         MOVE_CSV_FIELD_UP,
         CHANGE_CSV_FIELD,
         UNSET_FIELD,
         SET_REALTIME_FIELD,
         SET_REALTIME_DEFAULT_FIELD } from '../actions/inputProcessorActions';

const defaultState = Immutable.fromJS({
  file_type: '',
  usaget_type: 'static',
  delimiter: '',
  fields: [],
  field_widths: {},
  processor: {
    usaget_mapping: [],
  },
  customer_identification_fields: [],
  rate_calculators: {},
  /* receiver: {
   *   passive: false,
   *   delete_received: false
   * }*/
});

const defaultCustomerIdentification = Immutable.fromJS({
  target_key: 'sid',
  src_key: '',
  conditions: [{
    field: 'usaget',
    regex: "/.*/",
  }],
  clear_regex: '//',
});

export default function (state = defaultState, action) {
  const { field, mapping, width, index } = action;
  let field_to_move;
  switch (action.type) {
    case GOT_PROCESSOR_SETTINGS:
      return Immutable.fromJS(action.settings);

    case SET_NAME:
      return state.set('file_type', action.file_type);

    case SET_PROCESSOR_TYPE:
      return state.set('type', action.processor_type);

    case SET_DELIMITER_TYPE:
      return state.set('delimiter_type', action.delimiter_type);

    case SET_DELIMITER:
      return state.set('delimiter', action.delimiter);

    case SET_FIELDS:
      if (state.get('fields').size > 0) {
        return state.update('fields', list => [...list, ...action.fields]);
      }
      return state.set('fields', Immutable.fromJS(action.fields));

    case SET_FIELD_WIDTH:
      return state.setIn(['field_widths', field], parseInt(width, 10));

    case SET_FIELD_MAPPING:
      return state.setIn(['processor', field], mapping);

    case ADD_CSV_FIELD:
      return state.update('fields', list => list.push(action.field));

    case REMOVE_CSV_FIELD:
      return state.update('fields', list => list.remove(action.index));

    case REMOVE_ALL_CSV_FIELDS:
      return state.set('fields', Immutable.List());

    case SET_USAGET_TYPE:
      return state
        .set('usaget_type', action.usaget_type)
        .set('customer_identification_fields', Immutable.List())
        .setIn(['processor', 'usaget_mapping'], Immutable.List())
        .setIn(['processor', 'default_usaget'], '')
        .setIn(['processor', 'src_field'], '')
        .setIn(['rate_calculators'], Immutable.Map());

    case SET_STATIC_USAGET: {
      const customerIdentification = defaultCustomerIdentification.setIn(['conditions', 0, 'regex'], `/^${action.usaget}$/`);
      return state
        .setIn(['processor', 'default_usaget'], action.usaget)
        .setIn(['rate_calculators', action.usaget], Immutable.List())
        .update('customer_identification_fields', Immutable.List(), list => list.clear().push(customerIdentification));
    }

    case MAP_USAGET: {
      const { pattern, usaget } = action.mapping;
      const newMap = Immutable.fromJS({ pattern, usaget });
      const customerIdentification = defaultCustomerIdentification.setIn(['conditions', 0, 'regex'], `/^${usaget}$/`);
      return state
        .updateIn(['processor', 'usaget_mapping'], list => list.push(newMap))
        .setIn(['rate_calculators', usaget], Immutable.List())
        .update('customer_identification_fields', Immutable.List(), list => list.push(customerIdentification));
    }

    case REMOVE_USAGET_MAPPING:
      return state
        .updateIn(['processor', 'usaget_mapping'], list => list.remove(action.index))
        .updateIn(['customer_identification_fields'], list => list.remove(action.index));

    case SET_CUSETOMER_MAPPING:
      return state.setIn(['customer_identification_fields', action.index, field], mapping);

    case SET_RATING_FIELD:
      var { rate_key, value, usaget } = action;
      let new_rating = Immutable.fromJS({
        type: value,
        rate_key,
        line_key: state.getIn(['rate_calculators', usaget, 0, 'line_key'])
      });
      return state.setIn(['rate_calculators', usaget, 0], new_rating);

    case SET_LINE_KEY:
      var { value, usaget } = action;
      return state.setIn(['rate_calculators', usaget, 0, 'line_key'], value);

    case SET_RECEIVER_FIELD:
      return state.setIn(['receiver', field], mapping);

    case CLEAR_INPUT_PROCESSOR:
      return defaultState;

    case SET_INPUT_PROCESSOR_TEMPLATE:
      return Immutable.fromJS(action.template);

    case MOVE_CSV_FIELD_UP:
      field_to_move = field ? field : state.getIn(['fields', index]);
      return state.update('fields', list => list.delete(index).insert(index-1, field_to_move));

    case MOVE_CSV_FIELD_DOWN:
      field_to_move = field ? field : state.getIn(['fields', index]);
      return state.update('fields', list => list.delete(index).insert(index+1, field_to_move));

    case CHANGE_CSV_FIELD:
      return state.update('fields', list => list.set(index, action.value));

    case UNSET_FIELD:
      return state.deleteIn(action.path);

    case SET_PARSER_SETTING:
      return state.setIn(['parser', action.name], action.value);

    case SET_REALTIME_FIELD:
      return state.setIn(['realtime', action.name], Immutable.fromJS(action.value));

    case SET_REALTIME_DEFAULT_FIELD:
      return state.setIn(['realtime', 'default_values', action.name], action.value);

    default:
      return state;
  }
}
