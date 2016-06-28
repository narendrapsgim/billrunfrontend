import {closeLoginPopup, showStatusMessage} from '../actions';

export default function({dispatch}){
  return next => action => {
    if( (action.type == "login" || action.type == "checkLogin" ) && typeof action.data.then === 'function'){
      action.data.then(
        response => {
          //If login Check for success logn
          if(action.type == "login"){
            if(response.data && response.data.status){
              dispatch(closeLoginPopup());
              dispatch(showStatusMessage('Welcome !', 'success'));
              let newAction = Object.assign({}, action,  {type : 'login', data: response.data.details});
              dispatch(newAction);
            } else {
              dispatch(showStatusMessage('Incorrect user name or password, please try again.', 'error'));
            }
          }
          //check if user already logdedin
          else if(action.type == "checkLogin") {
            if(response.data && response.data.status){
               let newAction = Object.assign({}, {type : 'login', data: response.data.details});
               dispatch(newAction);
            } else {
               let newAction = Object.assign({}, {type : 'logout'});
               dispatch(newAction);
            }

        }
      }).catch(
        error => { // The request was made, but the server responded with a status code that falls out of the range of 2xx
          console.log("Login API errror : ", error);
          if (error instanceof Error) {
            dispatch(showStatusMessage(error.message, 'error'));
          } else {
            dispatch(showStatusMessage('An error occured, please try again later ...', 'error'));
          }
        }
      );
    } else {
      return next(action);
    }
  };
}
