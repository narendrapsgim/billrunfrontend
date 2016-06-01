
export default function (state = {}, action) {
  
  switch (action.type) {

    case 'login':
      return Object.assign({}, state, { auth: true, roles: action.data.permissions, name: action.data.user });

    case 'logout':
      return Object.assign({}, state, { auth: false, roles: ['guest'], name: ''});

    default:
      return state;
  }

}
