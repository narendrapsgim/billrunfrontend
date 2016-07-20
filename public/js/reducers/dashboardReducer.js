import Immutable from 'immutable';

const defaultState = {};//Immutable.fromJS([]);

export default function(state = defaultState, action) {
  switch(action.type) {
    case 'GOT_DATA':
    // console.log(action);
      return Object.assign({}, state, {[action.chart_id] : action.chart_data} );
    case 'GOT_DATA_ERROR':
    console.log(action);
      return Object.assign({}, state, {[action.chart_id] : null} );
    default:
      return state;
  }
}
