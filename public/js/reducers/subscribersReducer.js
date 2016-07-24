import Immutable from 'immutable';
import moment from 'moment';

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
      const newsub = Immutable.fromJS({
        from: moment().format('x'),
        to: moment().add(1, 'years').format('x')
      });
      if (action.aid) return state.set('subscriber', newsub.set('aid', action.aid));
      return state.set('subscriber', newsub);

    case UPDATE_SUBSCRIBER_FIELD:
      return state.setIn(['subscriber', action.field_id], action.value);
      
    default:
      return state;
  }
}
