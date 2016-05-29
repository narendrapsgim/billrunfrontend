export default function({dispatch}){
  return next => action => {
    console.log(action.type);
    if(action.type == "login"){
      if(typeof action.data.then !== 'function'){
        return next(action);
      }

      action.data.then( response => {
        let newAction = Object.assign({}, action, {data:response.data.details});
        if(response.data && response.data.status){
           newAction = Object.assign(newAction, {type : 'login'});
        } else {
           newAction = Object.assign(newAction, {type : 'loginError'});
        }
        dispatch(newAction);
      });
    }

    else if(action.type == "checkLogin") {
      if(typeof action.data.then !== 'function'){
        return next(action);
      }

      action.data.then( response => {
        let newAction = Object.assign({}, action, {data:response.data.details});
        if(response.data && response.data.status){
           newAction = Object.assign(newAction, {type : 'login'});
        } else {
           newAction = Object.assign(newAction, {type : 'logout'});
        }
        dispatch(newAction);
      });

    }

    else {
      return next(action);
    }
  };
}
