
export default function login(state = {}, action) {

  let defaultState = Object.assign({}, {displayPopup:false});

  switch (action.type) {

    case 'openLoginPopup':
      return Object.assign({}, defaultState, state, { displayPopup: true });

    case 'closeLoginPopup':
      return Object.assign({}, defaultState, state, { displayPopup: false });

    default:
      return  Object.assign({},defaultState, state);
  }

}
