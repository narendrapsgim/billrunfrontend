import Immutable from 'immutable';
import _ from 'lodash';

import { SET_NAME,
         SET_DELIMITER_TYPE,
         GOT_PROCESSOR_SETTINGS,
         SET_FIELDS,
         SET_DELIMITER,
         SET_FIELD_MAPPING,
         REMOVE_CSV_FIELD,
         ADD_CSV_FIELD,
         MAP_USAGET,
         SET_CUSETOMER_MAPPING,
         SET_RATING_FIELD,
         SET_RECEIVER_FIELD,
         SET_FIELD_WIDTH,
         CLEAR_INPUT_PROCESSOR,
         GOT_INPUT_PROCESSORS,
         REMOVE_USAGET_MAPPING,
         SET_USAGET_TYPE } from '../actions/inputProcessorActions';

let defaultState = Immutable.fromJS({
  usaget_type: 'static',
  delimiter: '',
  fields: [],
  field_widths: {},
  processor: {
    usaget_mapping: [],
    static_usaget_mapping: {}
  },
  customer_identification_fields: [
    {
      conditions: [
        {
          field: "usaget",
          regex: "/.*/",
          target_key: "sid"
        }
      ],
      clear_regex: "//"
    }
  ],
  rate_calculators: {},
  receiver: {
    passive: false,
    delete_received: false
  }
});

export default function (state = defaultState, action) {
  const { field, mapping, width } = action;
  switch (action.type) {
    case GOT_PROCESSOR_SETTINGS:
      return Immutable.fromJS(action.settings);
      
    case SET_NAME:
      return state.set('file_type', action.file_type);

    case SET_DELIMITER_TYPE:
      return state.set('delimiter_type', action.delimiter_type);
      
    case SET_DELIMITER:
      return state.set('delimiter', action.delimiter);

    case  SET_FIELDS:
      if (state.get('fields').size > 0) return state.update('fields', list => list.concat(action.fields));
      return state.set('fields', Immutable.fromJS(action.fields));

    case SET_FIELD_WIDTH:
      return state.setIn(['field_widths', field], parseInt(width, 10));
      
    case SET_FIELD_MAPPING:
      return state.setIn(['processor', field], mapping);

    case ADD_CSV_FIELD:
      return state.update('fields', list => list.push(action.field));

    case REMOVE_CSV_FIELD:
      return state.update('fields', list => list.remove(action.index));

    case SET_USAGET_TYPE:
      return state.set('usaget_type', action.usaget_type);
      
    case MAP_USAGET:
      const usaget_mapping = state.getIn(['processor', 'usaget_mapping']);
      const { pattern, usaget } = action.mapping;
      const new_map = Immutable.fromJS({
        pattern,
        usaget
      });
      if (state.get('usaget_type') === 'static') {
        return state.setIn(['processor', 'static_usaget_mapping'], Immutable.fromJS(new_map)).setIn(['rate_calculators', usaget], Immutable.List());
      }
      return state.updateIn(['processor', 'usaget_mapping'], list => list.push(new_map)).setIn(['rate_calculators', usaget], Immutable.List());

    case REMOVE_USAGET_MAPPING:
      return state.updateIn(['processor', 'usaget_mapping'], list => list.remove(action.index));
      
    case SET_CUSETOMER_MAPPING:
      return state.setIn(['customer_identification_fields', 0, field], mapping);

    case SET_RATING_FIELD:
      var { rate_key, value, usaget } = action;
      let new_rating = Immutable.fromJS({
        type: value,
        rate_key,
        line_key: state.get('usaget_type') === "static" ?
          'stamp' :
          state.getIn(['processor', 'src_field'])
      });
      return state.setIn(['rate_calculators', usaget, 0], new_rating);

    case SET_RECEIVER_FIELD:
      return state.setIn(['receiver', field], mapping);
      
    case CLEAR_INPUT_PROCESSOR:
      return defaultState;

    default:
      return state;
  }
}
