export default function users(state = {auth: false}, action) {
  switch (action.type) {
    case 'login': return Object.assign({}, state, {auth:true});
      break;
    case 'logout': return Object.assign({}, state, {auth:false});
      break;
    default: return state;
  }
}
