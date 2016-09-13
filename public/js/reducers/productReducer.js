import { UPDATE_PRODUCT_PROPERTIES_VALUE,
         UPDATE_PRODUCT_PREFIXES,
         ADD_PRODUCT_PROPERTIES,
         REMOVE_PRODUCT_PROPERTIES,
         GOT_PRODUCT,
         SAVE_PRODUCT,
         CLEAR_PRODUCT } from '../actions/productActions';

import moment from 'moment';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  key: '',
  description: '',
  unit_price: '',
  from: moment().toISOString(),
  vatable: true,
  to: moment().add(1, 'years').toISOString(),
  rates: []
});

export default function (state = defaultState, action) {
  const { field_idx, field_name, field_value } = action;
  switch (action.type) {
    case UPDATE_PRODUCT_PROPERTIES_VALUE:
      if (field_idx === -1)
        return state.set(field_name, field_value);
      return state.setIn(['rates', field_idx, field_name], field_value);

    case UPDATE_PRODUCT_PREFIXES:
      return state.setIn(['params', 'prefix'], field_value);
      
    case ADD_PRODUCT_PROPERTIES:
      let new_rate = Immutable.fromJS({
        from: undefined,
        to: undefined,
        interval: undefined,
        price: undefined
      });
      return state.update('rates', list => list.push(new_rate));

    case REMOVE_PRODUCT_PROPERTIES:
      return state.update('rates', list => list.delete(action.idx));

    case GOT_PRODUCT:
      return Immutable.fromJS(action.product);

    case CLEAR_PRODUCT:
      return defaultState;
      
    default:
      return state;
  }
}
