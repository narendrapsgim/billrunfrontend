export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const UPDATE_NOTIFICATION_FIELD = 'UPDATE_NOTIFICATION_FIELD';
export const ADD_BALANCE_NOTIFICATIONS = 'ADD_BALANCE_NOTIFICATIONS';
export const REMOVE_BALANCE_NOTIFICATIONS = 'REMOVE_BALANCE_NOTIFICATIONS';
export const BLOCK_PRODUCT = 'BLOCK_PRODUCT';

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

export function removeBalanceNotifications(balance_id) {
  return {
    type: REMOVE_BALANCE_NOTIFICATIONS,
    balance_id
  };
}

export function blockProduct(rate) {
  return {
    type: BLOCK_PRODUCT,
    rate
  };
}
