import { saveEntity, getEntityById, actions } from './entityActions';


export const getCustomer = id => getEntityById('customer', 'accounts', id);

export const getSubscription = id => getEntityById('subscription', 'subscribers', id);

export const saveCustomer = (customer, action) => saveEntity('accounts', customer, action);

export const saveSubscription = (subscription, action) => saveEntity('subscribers', subscription, action);

export const updateCustomerField = (path, value) => ({
  type: actions.UPDATE_ENTITY_FIELD,
  collection: 'customer',
  path,
  value,
});

export const clearCustomer = () => ({
  type: actions.CLEAR_ENTITY,
  collection: 'customer',
});
