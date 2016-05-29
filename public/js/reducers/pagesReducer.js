import * as actions from '../actions';
import View from '../view.js';
import _ from 'lodash';
import aja from 'aja';

export default function pages(state = {}, action) {
  let item, path;
  switch (action.type) {
  case actions.SET_INITIAL_ITEM:
    return Object.assign(
      {},
      state,
      {page: Object.assign({},
				{item: {}},
        {errorMessage: action.errorMessage}
       )}
     );
  case actions.UPDATE_FIELD_VALUE:
    item = _.cloneDeep(state.page.item);
    path = action.path.replace('item.', '');
    _.set(item, path, action.field_value);
    return Object.assign(
      {},
      state,
      {page: Object.assign({},
        {item: item},
        {errorMessage: action.errorMessage}
      )}
    );
  case actions.NEW_FIELD:
    item = _.cloneDeep(state.page.item);
    path = action.path.replace('item.', '');
    if (action.field_type === "object") {
      _.set(item, path, {});
    } else if (action.field_type === "array") {
      let r = _.result(item, path)
      r.push({});
    }
    return Object.assign(
      {},
      state,
      {page: Object.assign({},
        {item: item},
        {errorMessage: action.errorMessage}
      )}
    );
  case actions.REMOVE_FIELD:
    item = _.cloneDeep(state.page.item);
    path = action.path.replace('item.', '');
    _.unset(item, path);
    return Object.assign({},
      state,
      {page: Object.assign({},
        {item: item},
        {errorMessage: action.errorMessage}
      )}
    );
  case actions.GOT_ITEM:
    return Object.assign({},
      state,
      {page: Object.assign({},
        {item: action.item},
        {errorMessage: action.errorMessage}
       )}
   );
  case actions.SAVE_ITEM_ERROR:
    return Object.assign({},
      state,
      {page: Object.assign({},
				{item: action.item},
        {errorMessage: action.errorMessage}
       )}
   );
  default:
    return state;
  }
}
