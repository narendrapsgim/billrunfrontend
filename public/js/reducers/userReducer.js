
export default function users(state = {auth: false, roles:['guest']}, action) {
console.log(action.type);
  switch (action.type) {

    case 'login':
      console.log(action, state);
      return Object.assign({}, state, {auth:true, roles: action.data.permissions, name: action.data.user});

    case 'logout':
      console.log(action, state);
      return Object.assign({}, state, {auth:false, roles: ['guest'], name: ''});

    default: return state;
  }

}
