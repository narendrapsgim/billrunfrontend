import Immutable from 'immutable';

import { GOT_SUBSCRIBERS,
         GET_NEW_SUBSCRIBER,
         UPDATE_SUBSCRIBER_FIELD } from '../actions/subscribersActions';

const defaultState = Immutable.fromJS({
  subscribers: [],
  subscriber: {}
});

export default function (state = defaultState, action) {
  switch (action.type) {
    case GOT_SUBSCRIBERS:
      return state.set('subscribers', Immutable.fromJS(action.subscribers));

    case GET_NEW_SUBSCRIBER:
      if (action.aid) return state.set('subscriber', Immutable.fromJS({aid: action.aid}));
      return state.set('subscriber', Immutable.fromJS({}));

    case UPDATE_SUBSCRIBER_FIELD:
      return state.setIn(['subscriber', action.field_id], action.value);
      
    default:
      return state;
  }
}
