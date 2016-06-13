import * as actions from '../actions';
import _ from 'lodash';

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
    let s = state.product_properties.map((prop, idx) => {
      if (idx !== field_idx) return prop;
      return {
        ...prop,
        [field_name]: field_value
      };
    });
    return Object.assign({}, state, {
      product_properties: s
    });
    case actions.ADD_PRODUCT_PROPERTIES:
      let new_props = {
        ProductType:0,
        FlatRate:'',
        PerUnit:'',
        Type:''      
      };
      return Object.assign({}, state, {
        product_properties: [...state.product_properties, new_props]
      });
    case actions.REMOVE_PRODUCT_PROPERTIES:
      return Object.assign({}, state, {
        product_properties: state.product_properties
                                 .slice(0, action.idx)
                                 .concat(state.product_properties.slice(action.idx + 1))
      });
    case actions.GET_PLAN:
      return {
        basic_settings: {
          PlanName: 'Test',
          PlanCode: '123',
          PlanDescription: 'A plan description',
          TrialTransaction: '',
          PeriodicalRate: '',
          Each: '',
          EachPeriod: "Month",
          Cycle: '',
          From: '',
          To: ''
        },
        product_properties: [{
          ProductType:'',
          FlatRate:'',
          PerUnit:'',
          Type:''
        }]
      };        
    default:
      if (!_.isEmpty(state)) {
        return state;
      }
      return {
        basic_settings: {
          PlanName: '',
          PlanCode: '',
          PlanDescription: '',
          TrialTransaction: '',
          PeriodicalRate: '',
          Each: '',
          EachPeriod: "Month",
          Cycle: '',
          From: '',
          To: ''
        },
        product_properties: [{
          ProductType:'',
          FlatRate:'',
          PerUnit:'',
          Type:''
        }]
      };
  }
}
