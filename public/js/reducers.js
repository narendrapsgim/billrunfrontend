import { UPDATE_FIELD_VALUE, GOT_ITEM, SAVE_FORM, SET_INITIAL_ITEM } from './actions';

export default function rootReducer(state = {}, action) {
  switch (action.type) {
  case SET_INITIAL_ITEM:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
					state[action.page_name],
					{item: {}}
				       )});
  case UPDATE_FIELD_VALUE:
    return Object.assign({}, state, {
      [action.page_name]: Object.assign({},
                                        state[action.page_name], {
					  item: Object.assign({}, state[action.page_name].item, {
                                            [action.field_id]: action.field_value
                                          })
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
