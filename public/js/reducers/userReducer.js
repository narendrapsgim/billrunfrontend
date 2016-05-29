
export default function users(state = {}, action) {

  let defaultSate = Object.assign({}, {auth: false, roles:['guest'], errorMessage:''});

  switch (action.type) {

    case 'login': {
      let newState = {
        auth:true,
        roles: action.data.permissions,
        name: action.data.user,
        errorMessage: ''
      };
      return Object.assign({}, defaultSate, state, newState);
    }
    case 'logout': {
      let newState =  {
        auth:false,
        roles: ['guest'],
        name: '',
        errorMessage: ''
      };
      return Object.assign({}, defaultSate,  state, newState);
    }
    case 'loginError': {
      let newState =  {
        auth:false,
        roles: ['guest'],
        name: '',
        errorMessage: 'Incorrect user or password, please try again.'
      };
      return Object.assign({}, defaultSate, state, newState);
    }
    default: return state;
  }

}
