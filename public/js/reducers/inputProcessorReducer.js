import Immutable from 'immutable';

import { GOT_PROCESSOR_SETTINGS,
         SET_FIELDS,
         SET_DELIMITER,
         SET_FIELD_MAPPING,
         ADD_CSV_FIELD,
         ADD_USAGET_MAPPING,
         SET_CUSETOMER_MAPPING,
         SET_RATING_FIELD,
         SET_RECEIVER_FIELD } from '../actions/inputProcessorActions';

let defaultState = Immutable.fromJS({
  delimiter: '',
  fields: [],
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
  const { field, mapping } = action;
  switch (action.type) {
    case GOT_PROCESSOR_SETTINGS:
      console.log(action.settings);
      return Immutable.fromJS(action.settings);

    case SET_DELIMITER:
      return state.set('delimiter', action.delimiter);

    case  SET_FIELDS:
      return state.set('fields', Immutable.fromJS(action.fields));

    case SET_FIELD_MAPPING:
      return state.setIn(['processor', field], mapping);

    case ADD_CSV_FIELD:
      const fields = state.get('fields');
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
      
    default:
      return state;
  }
}
