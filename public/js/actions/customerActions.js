import { saveEntity, getEntityById, actions } from './entityActions';


export function getCustomer(id) {
  return getEntityById('customer', 'accounts', id);
}

export function saveCustomer(customer, action) {
  return saveEntity('accounts', customer, action);
}

export function saveSubscription(subscription, action) {
  return saveEntity('subscribers', subscription, action);
}

export function updateCustomerField(path, value) {
  return {
    type: actions.UPDATE_ENTITY_FIELD,
    collection: 'customer',
    path,
    value,
  };
}

export function clearCustomer() {
  return {
    type: actions.CLEAR_ENTITY,
    collection: 'customer',
  };
}
