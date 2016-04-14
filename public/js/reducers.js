import { UPDATE_FIELD_VALUE, GOT_ITEM } from './actions';

export default function rootReducer(state = {}, action) {
  switch (action.type) {
  case UPDATE_FIELD_VALUE:
    return Object.assign({},state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
                                          [action.field_id]: action.field_value
                                        })
    });
  case GOT_ITEM:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
                                          item: action.item
                                        })
    });
  default:
    return state;
  }
}
