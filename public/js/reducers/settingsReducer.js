import { UPDATE_SETTING,
         GOT_SETTINGS } from '../actions/settingsActions';
import { ADD_USAGET_MAPPING } from '../actions/inputProcessorActions';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  subscribers: {
    account: {
      fields: []
    },
    subscriber: {
      fields: []
    }
  }
});

export default function (state = defaultState, action) {
  let { name, value, category, settings } = action;
  switch(action.type) {
  case UPDATE_SETTING:
    return state.setIn([category, name], value);

  case ADD_USAGET_MAPPING:
    const usaget_mapping = state.get('unit_types');
    return state.update('usage_types', list => list.push(action.usaget));

  case GOT_SETTINGS:
    return state.withMutations(map => {
      settings.map(setting => {
        map.set(setting.name, Immutable.fromJS(setting.data.details));
      });
    });

  default:
    return state;    
  }
}
