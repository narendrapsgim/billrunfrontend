
export default function (state = {}, action) {

  switch (action.type) {

    case 'openLoginPopup':
      return Object.assign({}, state, { displayPopup: true });

    case 'closeLoginPopup':
      return Object.assign({}, state, { displayPopup: false });

    default:
      return state;
  }

}
