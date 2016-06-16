import * as actions from '../actions';
import _ from 'lodash';

const defaultState = {
  basic_settings: {
    PlanName: '',
    PlanCode: '',
    PlanDescription: '',
    TrialCycle: '',
    TrialPrice: '',
    PeriodicalRate: '',
    Each: '',
    EachPeriod: "Month",
    Cycle: '',
    From: '',
    To: ''
  },
  product_properties: {
    ProductName: '',
    properties: [{
      ProductType:'',
      FlatRate:'',
      PerUnit:'',
      Type:''
    }]
  }
};

export default function (state = {}, action) {
  switch (action.type) {
  case actions.UPDATE_PLAN_FIELD_VALUE:
    if (_.isUndefined(state[action.section])) {
      return Object.assign({}, state, {
        [action.section]: {
          [action.field_name]: action.field_value
        }
      });
    }

    return Object.assign({}, state, {
      [action.section]: Object.assign({}, state[action.section], {
        [action.field_name]: action.field_value
      })
    });

    case actions.UPDATE_PRODUCT_PROPERTIES_VALUE:
    let { field_idx, field_name, field_value } = action;
    if (field_idx === -1) {
      return Object.assign({}, state, {
        product_properties: Object.assign({}, state.product_properties, {
          [field_name]: field_value
        })
      });
    }
    let s = state.product_properties.properties.map((prop, idx) => {
      if (idx !== field_idx) return prop;
      return {
        ...prop,
        [field_name]: field_value
      };
    });
    return Object.assign({}, state, {
      product_properties: Object.assign({}, state.product_properties, {
        properties: s
      })
    });

    case actions.ADD_PRODUCT_PROPERTIES:
      let new_props = {
        ProductType:0,
        FlatRate:'',
        PerUnit:'',
        Type:''      
      };
      return Object.assign({}, state, {
        product_properties: Object.assign({}, state.product_properties, {
          properties: [...state.product_properties.properties, new_props]
        })
      });

    case actions.REMOVE_PRODUCT_PROPERTIES:
      return Object.assign({}, state, {
        product_properties: Object.assign({}, state.product_properties, {
          properties: state.product_properties.properties
            .slice(0, action.idx)
            .concat(state.product_properties.properties.slice(action.idx + 1))
        })
      });

    case actions.GET_PLAN:
      return {
        basic_settings: {
          PlanName: 'Test',
          PlanCode: '123',
          PlanDescription: 'A plan description',
          TrialTransaction: '',
          PlanFee: '',
          TrialCycle: '',
          PeriodicalRate: '',
          Each: '',
          EachPeriod: "Month",
          Cycle: '',
          From: '',
          To: ''
        },
        product_properties: {
          ProductName: '',
          properties: [{
            ProductType:'',
            FlatRate:'',
            PerUnit:'',
            Type:''
          }]
        }
      };

    case actions.CLEAR_PLAN:
      return defaultState;

    case actions.GET_PRODUCT:
      return {
        product_properties: {
          ProductName: 'Product',
          properties: [{
            ProductType:'Metered',
            FlatRate:'123',
            PerUnit:'1',
            Type:'Metered'
          }]
        }
      };

    case actions.SAVE_PLAN:
      console.log('saving plan', state);
      return state;
      
    default:
      if (!_.isEmpty(state)) {
        return state;
      }
      return defaultState;
  }
}
