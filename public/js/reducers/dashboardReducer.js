import Immutable from 'immutable';

const defaultState = Immutable.fromJS([]);

export default function (state = defaultState, action) {
  switch (action.type) {
    case GOT_STUFF:
      return Immutable.fromJS(action.stuff);
    default:
      return state;
  }
}
