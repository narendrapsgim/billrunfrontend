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

function buildPlanFromState(state) {
  let { basic_settings, product_properties } = state;
  let from = new Date();
  let to = new Date();
  let trial_to = new Date();
  switch (basic_settings.EachPeriod) {
  case "Month":
    to = to.setMonth(to.getMonth() + parseInt(basic_settings.Cycle, 10));
    if (basic_settings.TrialCycle) {
      trial_to = trial_to.setMonth(trial_to.getMonth() + parseInt(basic_settings.TrialCycle, 10));
    }
    break;
  case "Day":
    to = to.setDate(to.getDate() + parseInt(basic_settings.Cycle, 10));
    if (basic_settings.TrialCycle) {
      trial_to = trial_to.setDate(trial_to.getDate() + parseInt(basic_settings.TrialCycle, 10));
    }
    break;
  }
  return {
    name: basic_settings.PlanName,
    price: [
      {price: basic_settings.TrialPrice,
       duration: {
         from: from,
         to: trial_to
       }
      },
      {price: basic_settings.PeriodicalRate,
       duration: {
         from: from,
         to: to
       }
      }
    ],
    recurring: {
      duration: basic_settings.Cycle,
      unit: basic_settings.EachPeriod
    }
  };
}

function buildRateFromState(state) {
  let { basic_settings, product_properties } = state;
  let rates  = _.reduce(product_properties.properties, (res, val, key) => {
    (res[val.PerUnit]) ?
      res[val.PerUnit]["BASE"] = {rate: {}} :
      res[val.PerUnit] = {BASE: {rate: {price: val.FlatRate}}};
    if (basic_settings) res[val.PerUnit][basic_settings.PlanName] = {rate: {price: val.FlatRate}};
    return res;
  }, {});
  return {
    key: product_properties.ProductName,
    rates
  };
}

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
      let plan = buildPlanFromState(state);
      let rate = buildRateFromState(state);
      console.log("saving plan & rate", plan, rate);
      return state;
      
    default:
      if (!_.isEmpty(state)) {
        return state;
      }
      return defaultState;
  }
}
