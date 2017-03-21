import { saveEntity, getEntityById, gotEntity, setCloneEntity, actions } from './entityActions';
import { getEntityByIdQuery } from '../common/ApiQueries';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { startProgressIndicator } from './progressIndicatorActions';


export const getCustomer = id => getEntityById('customer', 'accounts', id);

export const getSubscription = id => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getEntityByIdQuery('subscribers', id);
  return apiBillRun(query)
    .then((response) => {
      const item = response.data[0].data.details[0];
      item.originalValue = item.from;
      dispatch(gotEntity('subscription', item));
      return dispatch(apiBillRunSuccessHandler(response));
    })
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error retreiving subscription')));
};

export const saveCustomer = (customer, action) => saveEntity('accounts', customer, action);

export const setCloneSubscription = () => setCloneEntity('subscription', 'subscription');

export const saveSubscription = (subscription, action) => dispatch =>
  dispatch(saveEntity('subscribers', subscription, action))
    .then(response => Object.assign(response, { subscription, action }));


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
