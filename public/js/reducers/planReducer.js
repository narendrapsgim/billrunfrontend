import * as actions from '../actions/planActions';
import _ from 'lodash';
import moment from 'moment';

const defaultState = {
  basic_settings: {
    PlanName: '',
    PlanCode: '',
    PlanDescription: '',
    TrialCycle: '',
    TrialPrice: '',
    Each: '',
    EachPeriod: "Month",
    from: moment().unix() * 1000,
    to: moment().add(1, 'years').unix() * 1000,
    recurring_prices: [
      {
        Cycle: '',
        PeriodicalRate: '',
        EndOfDays: true
      }
    ],
    From: '',
    To: ''
  }
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case actions.UPDATE_PLAN_FIELD_VALUE:
      if (_.isUndefined(state[action.section])) {
        return Object.assign({}, state, {
          basic_settings: Object.assign({}, state.basic_settings, {
            [action.field_name]: action.field_value
          })
        });
      }

      return Object.assign({}, state, {
        [action.section]: Object.assign({}, state[action.section], {
          [action.field_name]: action.field_value
        })
      });

    case actions.UPDATE_PLAN_RECURRING_PRICE_VALUE:
      let { field_idx, field_name, field_value } = action;
      var s = state.basic_settings.recurring_prices.map((price, idx) => {
        if (idx !== field_idx) return price;
        return {
          ...price,
          [field_name]: field_value
        };
      });
      return Object.assign({}, state, {
        basic_settings: Object.assign({}, state.basic_settings, {
          recurring_prices: s
        })
      });

    case actions.ADD_TARIFF:
      let new_tariff = {
        Cycle: '',
        PeriodicalRate: '',
        EndOfDays: true
      };

      let len = state.basic_settings.recurring_prices.length - 1;
      var s = state.basic_settings.recurring_prices.map((price, idx) => {
        if (idx !== len) return price;
        return {
          ...price,
          EndOfDays: false
        };
      });
      return Object.assign({}, state, {
        basic_settings: Object.assign({}, state.basic_settings, {
          recurring_prices: [...s, new_tariff]
        })
      });
      
    case actions.GOT_PLAN:
      return action.plan;

    case actions.CLEAR_PLAN:
      return defaultState;
      
    default:
      return state;
  }
}
