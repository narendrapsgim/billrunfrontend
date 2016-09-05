import Immutable from 'immutable';
import { LOGIN, LOGOUT, LOGIN_ERROR } from '../actions/userActions';

var defaultSate = Immutable.fromJS({
  auth: false,
  name: '',
  roles: ['guest'],
  error:''
})

export default function (state = defaultSate, action) {

  switch (action.type) {
    case LOGIN:
      return Immutable.fromJS({auth: true, roles: action.data.permissions, name: action.data.user, error:''});
    case LOGOUT:
      return Immutable.fromJS(defaultSate);
    case LOGIN_ERROR:
      return defaultSate.set('error', 'Incorrect user name or password, please try again.');
    default:
      return state;
  }

}
