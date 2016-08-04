import * as actions from '../actions';
import _ from 'lodash';


export default function (state = {}, action) {
  let item, path;
  switch (action.type) {
  case actions.SET_INITIAL_ITEM:
    return Object.assign(
      {},
      state,
      {page: Object.assign({}, {item: {}} )}
    );
  case actions.UPDATE_FIELD_VALUE:
    //Edit multiple items
    if(action.action == "edit_multiple"){
      let items = _.cloneDeep(state.page.items);
      items.forEach( (item) => {
        let item_path = action.fieldsMap[action.path][item._id['$id']];
        _.setWith(item, item_path, action.field_value);
      });
      return Object.assign(
        {},
        state,
        {page: Object.assign({}, state.page, {items: items} )}
      );
    }
    //Edit single items
    else {
      item = _.cloneDeep(state.page.item);
      path = action.path.replace('item.', '');
      _.setWith(item, path, action.field_value);
      return Object.assign(
        {},
        state,
        {page: Object.assign({}, state.page, {item: item} )}
      );
    }
  case actions.NEW_FIELD:
    item = _.cloneDeep(state.page.item);
    path = action.path.replace('item.', '');
    if (action.field_type === "object") {
      _.set(item, path, {});
    } else if (action.field_type === "array") {
      let r = _.result(item, path);
      if (!r) {
        _.set(item, path, []);
        r = _.result(item, path);
      } else {
        r = _.result(item, path.slice(0, -3));
      }
      r.push({});
    }
    return Object.assign(
      {},
      state,
      {page: Object.assign({}, state.page, {item: item} )}
    );
  case actions.REMOVE_FIELD:
    item = _.cloneDeep(state.page.item);
    path = action.path.replace('item.', '');
    _.unset(item, path);
    return Object.assign({},
      state,
      {page: Object.assign({}, state.page, {item: item} )}
    );
  case actions.GOT_ITEM:
    return Object.assign({},
      state,
      {page: Object.assign({}, {item: action.item} )}
   );
  case actions.GOT_ITEMS:
    return Object.assign({},
      state,
      {page: Object.assign({}, {items: action.items}, {item:{}} )}
   );
  case actions.SAVE_ITEM_ERROR:
    return Object.assign({},
      state,
      {page: Object.assign({}, {item: action.item} )}
   );
  default:
    return state;
  }
}
