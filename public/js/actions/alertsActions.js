import Immutable from 'immutable';
import md5 from 'md5';

export const SUCCESS = "success";
export const WARNING = "warning";
export const DANGER = "danger";
export const INFO = "info";

export const DISMISS_ALL_ALERTS = 'DISMISS_ALL_ALERTS';
export const DISMISS_ALERT = 'DISMISS_ALERT';
export const SHOW_ALERT = 'SHOW_ALERT';

export const SHOW_SUCCESS = 'SHOW_SUCCESS';
export const SHOW_WARNING = 'SHOW_WARNING';
export const SHOW_DANGER = 'SHOW_DANGER';
export const SHOW_INFO = 'SHOW_INFO';

const Alert = Immutable.Record({
  type: "info",
  message: "",
  id: new Date(),
  timeout: 4000
});

export function showSuccess(message = '', timeout){
  return showAlert(message, SUCCESS, timeout);
}

export function showWarning(message = '', timeout){
  return showAlert(message, WARNING, timeout);
}

export function showDanger(message = '', timeout){
  timeout = (typeof timeout === 'undefined') ? null : timeout;
  return showAlert(message, DANGER, timeout);
}

export function showInfo(message = '', timeout){
  return showAlert(message, INFO, timeout);
}

export function showAlert(message = '', type = INFO, timeout){
  let alert = new Alert({ message, type, id: md5(message) });

  if(typeof timeout !== 'undefined'){
    alert = alert.set('timeout', timeout);
  }

  return {
    type: SHOW_ALERT,
    alert
  };
}

export function hideAlert(id){
  return {
    type: DISMISS_ALERT,
    id
  };
}

export function hideAllAlerts(){
  return {
    type: DISMISS_ALL_ALERTS,
  };
}
