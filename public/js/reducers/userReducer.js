import Immutable from 'immutable';
import { LOGIN, LOGOUT, LOGIN_ERROR } from '../actions/userActions';

var User = Immutable.Record({
  auth: null,
  name: '',
  roles: ['guest'],
  error:''
});

export default function (state = new User(), action) {

  switch (action.type) {
    case LOGIN:
      return new User({auth: true, roles: action.data.permissions, name: action.data.user});

    case LOGOUT:
      return new User({auth: false});

    case LOGIN_ERROR:
      return state.set('error', 'Incorrect user name or password, please try again.');

    default:
      return state;
  }

}
