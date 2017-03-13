import Immutable from 'immutable';
import { LOGIN, LOGOUT, LOGIN_ERROR, CLEAR_LOGIN_ERROR } from '../actions/userActions';

const User = Immutable.Record({
  auth: null,
  name: '',
  roles: ['guest'],
  error: '',
});

export default function (state = new User(), action) {
  switch (action.type) {
    case LOGIN:
      return new User({ auth: true, roles: action.data.permissions, name: action.data.user });

    case LOGOUT:
      return new User({ auth: false });

    case LOGIN_ERROR:
      return state.set('error', action.error);

    case CLEAR_LOGIN_ERROR:
      return state.set('error', '');

    default:
      return state;
  }
}
