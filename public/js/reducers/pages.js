import { UPDATE_FIELD_VALUE, GOT_ITEM, SAVE_FORM, SET_INITIAL_ITEM, NEW_FIELD, REMOVE_FIELD } from '../actions';
import View from '../view.js';
import _ from 'lodash';
import aja from 'aja';

export default function pages(state = {}, action) {
  let item, path;
  switch (action.type) {
  case SET_INITIAL_ITEM:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
					state[action.page_name],
					{item: {}}
				       )});
  case UPDATE_FIELD_VALUE:
    item = _.cloneDeep(state[action.page_name].item);
    path = action.path.replace('item.', '');
    _.set(item, path, action.field_value);
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
					  item: item
					})
    });
  case NEW_FIELD:
    item = _.cloneDeep(state[action.page_name].item);
    path = action.path.replace('item.', '');
    if (action.field_type === "object") {
      _.set(item, path, {});
    } else if (action.field_type === "array") {
      let r = _.result(item, path)
      r.push({});
    }
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
                                          item: item
                                        })
    });
  case REMOVE_FIELD:
    item = _.cloneDeep(state[action.page_name].item);
    path = action.path.replace('item.', '');
    _.unset(item, path);
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
  default:
    return state;
  }
}
