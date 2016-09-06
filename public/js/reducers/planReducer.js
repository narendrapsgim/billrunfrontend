import * as actions from '../actions/planActions';
import moment from 'moment';
import Immutable from 'immutable';

const defaultState = Immutable.fromJS({
  PlanName: '',
  PlanCode: '',
  PlanDescription: '',
  TrialCycle: '',
  TrialPrice: '',
  Each: '',
  EachPeriod: "Month",
  ChargingMode: "upfront",
  from: moment().unix() * 1000,
  to: moment().add(10, 'years').unix() * 1000,
  recurring_prices: [
    {
      Cycle: '',
      PeriodicalRate: '',
      EndOfDays: true
    }
  ],
  From: '',
  To: '',
  include: {}
});

export default function (state = defaultState, action) {
  const { field_idx, field_name, field_value } = action;
  switch (action.type) {
    case actions.REMOVE_INCLUDE:
      return state.deleteIn(['include', 'groups', action.groupName, action.usaget]);

    case actions.ADD_INCLUDE:
      return state.setIn(['include', 'groups', action.groupName, action.usaget], action.value);

    case actions.CHNAGE_INCLUDE:
      return state.updateIn(['include', 'groups', action.groupName, action.usaget], (value) => action.value);

    case actions.UPDATE_PLAN_FIELD_VALUE:
      return state.set(action.field_name, action.field_value);

    case actions.UPDATE_PLAN_RECURRING_PRICE_VALUE:
      return state.setIn(['recurring_prices', field_idx, field_name], field_value);

    case actions.ADD_TARIFF:
      let new_tariff = Immutable.fromJS({
        Cycle: '',
        PeriodicalRate: '',
        EndOfDays: true
      });
      let s = state.get('recurring_prices').size - 1;
      return state
                  .setIn(['recurring_prices', s, 'EndOfDays'], false)
                  .update('recurring_prices', list => list.push(new_tariff));

    case actions.REMOVE_RECURRING_PRICE:
      return state.update('recurring_prices', list => list.delete(action.idx));

    case actions.GOT_PLAN:
      return Immutable.fromJS(action.plan);

    case actions.CLEAR_PLAN:
      return defaultState;

    default:
      return state;
  }
}
