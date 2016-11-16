import Immutable from 'immutable';

const defaultState = Immutable.Map({});

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'GOT_DATA': {
      const chartData = action.chartData.map(dataSet => ({
        name: dataSet.name,
        data: dataSet.data.details,
      }));
      return state.set(action.chartId, chartData);
    }
    case 'GOT_DATA_ERROR':
      return state.set(action.chartId, null);
    default:
      return state;
  }
}
