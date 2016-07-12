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

function getToDate(settings, from, cycle) {
  let amt = settings.EachPeriod.toLowerCase() + 's';
  let each = parseInt(settings.Each, 10);
  if (!cycle) {
    return moment(from).add(100, "years").format();
  }

  return moment(from).add(parseInt(cycle, 10) * each, amt).format();
}

function buildPlanFromState(state) {
  let { basic_settings } = state;
  let prices = [];

  let { TrialPrice, TrialCycle } = basic_settings;
  if (TrialPrice && TrialCycle) {
    let trial_from = moment().format();
    let trial = {
      price: parseInt(TrialPrice, 10),
      duration: {
        from: trial_from,
        to: getToDate(basic_settings, trial_from, TrialCycle)
      }
    };
    prices.push(trial);
  }
  
  let p = _.reduce(basic_settings.recurring_prices, (acc, price, idx) => {
    if (!price.PeriodicalRate) return acc;

    let from = moment().format();
    let to = moment();

    if (acc.length && acc.length > idx) {
      from = moment(acc[idx]['duration']['to']).format();
    } else if (idx > 0) {
      from = moment(acc[idx - 1]['duration']['to']).format();
    }
    to = getToDate(basic_settings, from, price.Cycle);

    acc.push({
      price: parseInt(price.PeriodicalRate, 10),
      duration: {
        from,
        to
      }
    });
    return acc;
  }, prices);

  return {
    name: basic_settings.PlanName,
    price: prices,
    recurring: {
      duration: parseInt(basic_settings.Cycle, 10),
      unit: basic_settings.EachPeriod.toLowerCase()
    }
  };
}

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

    case actions.SAVE_PLAN:
      let plan = buildPlanFromState(state);
      console.log("saving plan", plan);
      return state;

    case actions.CLEAR_PLAN:
      return defaultState;
      
    default:
      return state;
  }
}
