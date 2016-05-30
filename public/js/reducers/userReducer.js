
export default function users(state = {}, action) {

  let defaultState = Object.assign({}, {auth: false, roles:['guest'], errorMessage:''});

  switch (action.type) {

    case 'login': {
      let newState = {
        auth:true,
        roles: action.data.permissions,
        name: action.data.user,
      };
      return Object.assign({}, defaultState, state, newState);
    }
    
    case 'logout': {
      let newState =  {
        auth:false,
        roles: ['guest'],
        name: '',
      };
      return Object.assign({}, defaultState,  state, newState);
    }

    default: return state;
  }

}
