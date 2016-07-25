import Immutable from 'immutable';

export default function (state = Immutable.fromJS({}), action) {
  
  switch (action.type) {
    case 'login':
      return Immutable.fromJS({auth: true, roles: action.data.permissions, name: action.data.user});
      /* return Object.assign({}, state, { auth: true, roles: action.data.permissions, name: action.data.user });
       */
    case 'logout':
      return Immutable.fromJS({auth: false, roles: ['guest'], name: ''});
      /* return Object.assign({}, state, { auth: false, roles: ['guest'], name: ''});
       */
    default:
      return state;
  }

}
