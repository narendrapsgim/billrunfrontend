import Immutable from 'immutable';

const defaultState = {};//Immutable.fromJS([]);

export default function(state = defaultState, action) {
  switch(action.type) {
    case 'GOT_DATA':
      let chartData = action.chartData.map((dataSet) => {return {name : dataSet.name, data:dataSet.data.details}});
      return Object.assign({}, state, {[action.chartId] : chartData} );
    case 'GOT_DATA_ERROR':
      return Object.assign({}, state, {[action.chartId] : null} );
    default:
      return state;
  }
}
