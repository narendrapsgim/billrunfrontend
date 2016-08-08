import { UPDATE_SETTING,
         GOT_SETTINGS } from '../actions/settingsActions';
import { ADD_USAGET_MAPPING } from '../actions/inputProcessorActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  account: {
    fields: []
  },
  subscriber: {
    fields: []
  },
  unit_types: []
});

export default function (state = defaultState, action) {
  let { name, value, category, settings } = action;
  switch(action.type) {
  case UPDATE_SETTING:
    return state.setIn(name, value);

  case ADD_USAGET_MAPPING:
    const usaget_mapping = state.get('unit_types');
    const { pattern, usaget } = action.mapping;
    const new_map = Immutable.fromJS({
      //src_field,
      //pattern: `/^${pattern}$/`,
      pattern,
      usaget
    });
    /* TODO: SET SRC_FIELD AND PATTERN REGEX WHEN SAVING AND SANITIZING!! */
    return state.set('unit_types', usaget_mapping.push(new_map));

  case GOT_SETTINGS:
    return state.set(category, Immutable.fromJS(settings));

  default:
    return state;    
  }
}
