import {closeLoginPopup} from '../actions';

export default function({dispatch}){
  return next => action => {
    if( (action.type == "login" || action.type == "checkLogin" ) && typeof action.data.then === 'function'){
      action.data.then( response => {
        //Create new action
        let newAction = Object.assign({}, action,  {data:response.data.details});
        //If login Check for success logn
        if(action.type == "login"){
          if(response.data && response.data.status){
            newAction = Object.assign(newAction, {type : 'login'});
            dispatch(closeLoginPopup());
          } else {
            newAction = Object.assign(newAction, {type : 'loginError'});
          }
        }
        //if check if user already logdedin
        else if(action.type == "checkLogin") {
          if(response.data && response.data.status){
             newAction = Object.assign(newAction, {type : 'login'});
          } else {
             newAction = Object.assign(newAction, {type : 'logout'});
          }
        }

        dispatch(newAction);
      });
    } else {
      return next(action);
    }
  };
}
