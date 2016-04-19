import { UPDATE_FIELD_VALUE, GOT_ITEM, SAVE_FORM, SET_INITIAL_ITEM } from './actions';
import _ from 'lodash';

export default function rootReducer(state = {}, action) {
  switch (action.type) {
  case SET_INITIAL_ITEM:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
					state[action.page_name],
					{item: {}}
				       )});
  case UPDATE_FIELD_VALUE:
    let item = _.cloneDeep(state[action.page_name].item);
    let path = action.path.replace('item.', '');
    _.set(item, path, action.field_value);
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
					  item: item
					})
    });
  case GOT_ITEM:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name],
					{item: action.item}
				       )});
  case SAVE_FORM:
    console.log("Sending AJAX with item: ", state[action.page_name].item);
    return state;
  default:
    return state;
  }
}
