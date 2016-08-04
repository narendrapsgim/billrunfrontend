import Immutable from 'immutable';
import _ from 'lodash';

import { SET_NAME,
         SET_DELIMITER_TYPE,
         GOT_PROCESSOR_SETTINGS,
         SET_FIELDS,
         SET_DELIMITER,
         SET_FIELD_MAPPING,
         ADD_CSV_FIELD,
         ADD_USAGET_MAPPING,
         SET_CUSETOMER_MAPPING,
         SET_RATING_FIELD,
         SET_RECEIVER_FIELD,
         SET_FIELD_WIDTH,
         CLEAR_INPUT_PROCESSOR,
         GOT_INPUT_PROCESSORS } from '../actions/inputProcessorActions';

let defaultState = Immutable.fromJS({
  delimiter: '',
  fields: [],
  field_widths: {},
  processor: {
    usaget_mapping: []
  },
  customer_identification_fields: [
    {
      conditions: [
        {
          field: "usaget",
          regex: "/.*/"
        }
      ],
      clear_regex: "//"
    }
  ],
  rate_calculators: {},
  receiver: {}
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
      if (state.get('fields').size > 0) return state.update('fields', list => list.concat2(action.fields));
      return state.set('fields', Immutable.fromJS(action.fields));

    case SET_FIELD_WIDTH:
      return state.setIn(['field_widths', field], parseInt(width, 10));
      
    case SET_FIELD_MAPPING:
      return state.setIn(['processor', field], mapping);

    case ADD_CSV_FIELD:
      if (!action.field || _.isEmpty(action.field.replace(/ /g, ''))) return state;
      const fields = state.get('fields');
      if (fields.includes(action.field)) return state;
      return state.set('fields', fields.push(action.field));

    case ADD_USAGET_MAPPING:
      const usaget_mapping = state.getIn(['processor', 'usaget_mapping']);
//      const src_field = state.getIn(['processor', 'src_field']);
      if (!src_field) return state;

      var { pattern, usaget } = action.mapping;
      const new_map = Immutable.fromJS({
        //src_field,
        //pattern: `/^${pattern}$/`,
        pattern,
        usaget
      });
      /* TODO: SET SRC_FIELD AND PATTERN REGEX WHEN SAVING AND SANITIZING!! */
      return state.setIn(['processor', 'usaget_mapping'], usaget_mapping.push(new_map)).setIn(['rate_calculators', usaget], Immutable.List());

    case SET_CUSETOMER_MAPPING:
      return state.setIn(['customer_identification_fields', 0, field], mapping);

    case SET_RATING_FIELD:
      var { rate_key, value, usaget } = action;
      let new_rating = Immutable.fromJS({
        type: value,
        rate_key,
        line_key: "name"
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
