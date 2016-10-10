import Immutable from 'immutable';

let DefaultState = Immutable.Map();

const serviceGroupReducer = (state = DefaultState, action) => {

  switch (action.type) {
    // case DISMISS_ALERT:
    //   return state.filter( (alert) => alert.get('id') !== action.id);

    default:
      return state;
  }

}

export default serviceGroupReducer;
