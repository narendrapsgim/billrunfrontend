export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const UPDATE_NOTIFICATION_FIELD = 'UPDATE_NOTIFICATION_FIELD';
export const ADD_BALANCE_NOTIFICATIONS = 'ADD_BALANCE_NOTIFICATIONS';

export function addBalanceNotifications(balance) {
  return {
    type: ADD_BALANCE_NOTIFICATIONS,
    balance
  };
}

export function addNotification(threshold_id) {
  return {
    type: ADD_NOTIFICATION,
    threshold_id
  };
}

export function removeNotification(threshold_id, index) {
  return {
    type: REMOVE_NOTIFICATION,
    threshold_id,
    index
  };
}

export function updateNotificationField(threshold_id, index, field, value) {
  return {
    type: UPDATE_NOTIFICATION_FIELD,
    threshold_id,
    index,
    field,
    value
  };
}
