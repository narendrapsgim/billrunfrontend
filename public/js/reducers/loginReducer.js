
export default function login(state = {}, action) {

  let defaultState = Object.assign({}, { errorMessage:'', displayPopup:false});

  switch (action.type) {

    case 'openLoginPopup': {
      let newState =  {
        errorMessage: '',
        displayPopup:true,
      };
      return Object.assign({}, defaultState, state, newState);
    }

    case 'closeLoginPopup': {
      let newState =  {
        errorMessage: '',
        displayPopup:false,
      };
      return Object.assign({}, defaultState, state, newState);
    }

    case 'loginError': {
      let newState =  {
        errorMessage: 'Incorrect user or password, please try again.'
      };
      return Object.assign({}, defaultState, state, newState );
    }

    default: return  Object.assign({},defaultState, state);
  }

}
