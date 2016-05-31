import {closeLoginPopup, showStatusMessage} from '../actions';

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
            dispatch(showStatusMessage('Welcome !', 'success'));
          } else {
            newAction = showStatusMessage('Incorrect user or password, please try again.', 'error');
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
      }).catch(
        error => { // The request was made, but the server responded with a status code that falls out of the range of 2xx
          let newAction = Object.assign({}, action);
          if (error instanceof Error) {
            newAction = showStatusMessage(error.message, 'error');
          } else {
            console.  log(error);
            newAction = showStatusMessage('An error occured, please try again later ...', 'error');
          }

          dispatch(newAction);
        }
      );
    } else {
      return next(action);
    }
  };
}
