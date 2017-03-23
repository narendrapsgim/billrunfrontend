import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { saveEntity, getEntityById, actions } from './entityActions';
import { getRebalanceAccountQuery, getCollectionDebtQuery } from '../common/ApiQueries';
import { startProgressIndicator } from './progressIndicatorActions';


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

export const rebalanceAccount = aid => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getRebalanceAccountQuery(aid);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Rebalance account request sent')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error rebalancing account')));
};

export const getCollectionDebt = aid => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getCollectionDebtQuery(aid);
  return apiBillRun(query)
    .then(response => dispatch(apiBillRunSuccessHandler(response)))
    .catch(error => dispatch(apiBillRunErrorHandler(error)));
};
