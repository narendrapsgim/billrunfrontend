import Immutable from 'immutable';

const defaultState = Immutable.Map({});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'GOT_DATA': {
      const { chartId, chartData } = action;
      return state.set(chartId, Immutable.fromJS(chartData));
    }
    case 'GOT_DATA_ERROR':
      return state.set(action.chartId, null);
    default:
      return state;
  }
}
