import { UPDATE_PRODUCT_PROPERTIES_VALUE,
         ADD_PRODUCT_PROPERTIES,
         REMOVE_PRODUCT_PROPERTIES,
         GOT_PRODUCT,
         SAVE_PRODUCT,
         CLEAR_PRODUCT } from '../actions/productActions';

import moment from 'moment';

const defaultState = {
  key: '',
  description: '',
  unit_price: '',
  from: moment().unix() * 1000,
  to: moment().add(1, 'years').unix() * 1000,
  rates: []
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case UPDATE_PRODUCT_PROPERTIES_VALUE:
      let { field_idx, field_name, field_value } = action;
      if (field_idx === -1) {
        return Object.assign({}, state, {
          [field_name]: field_value
        });
      }
      let s = state.rates.map((prop, idx) => {
        if (idx !== field_idx) return prop;
        return {
          ...prop,
          [field_name]: field_value
        };
      });
      return Object.assign({}, state, {
        rates: s
      });

    case ADD_PRODUCT_PROPERTIES:
      let new_rate = {
        from: undefined,
        to: undefined,
        interval: undefined,
        price: undefined
      };
      return Object.assign({}, state, {
        rates: [...state.rates, new_rate]
      });

    case REMOVE_PRODUCT_PROPERTIES:
      return Object.assign({}, state, {
        rates: state.rates
                         .slice(0, action.idx)
                         .concat(state.rates.slice(action.idx + 1))
      });

    case GOT_PRODUCT:
      return action.product;

    case CLEAR_PRODUCT:
      return defaultState;
      
    default:
      return state;
  }
}
