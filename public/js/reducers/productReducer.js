import { UPDATE_PRODUCT_PROPERTIES_VALUE,
         ADD_PRODUCT_PROPERTIES,
         REMOVE_PRODUCT_PROPERTIES,
         GOT_PRODUCT,
         SAVE_PRODUCT,
         CLEAR_PRODUCT } from '../actions/productActions';

function buildRateFromState(state) {
  let { rates } = state;
  let r  = _.reduce(rates, (res, val, key) => {
    res[state.unit] = {BASE: {rate: {...val}}};
    return res;
  }, {});
  return {
    key: state.key,
    rates: r
  };
}

const defaultState = {
  key: '',
  description: '',
  rates: [
    {
      from: undefined,
      to: undefined,
      interval: undefined,
      price: undefined
    }
  ]
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

    case SAVE_PRODUCT:
      let rate = buildRateFromState(state);
      console.log("saving product ", rate);
      return state;

    case CLEAR_PRODUCT:
      return defaultState;
      
    default:
      return state;
  }
}
