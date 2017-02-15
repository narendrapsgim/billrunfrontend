export const GOT_CUSTOMER = 'GOT_CUSTOMER';
export const UPDATE_CUSTOMER_FIELD = 'UPDATE_CUSTOMER_FIELD';
export const CLEAR_CUSTOMER = 'CLEAR_CUSTOMER';

import _ from 'lodash';
import moment from 'moment';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

export function updateCustomerField(field_id, value) {
  return {
    type: UPDATE_CUSTOMER_FIELD,
    field_id,
    value
  };
}

export function gotCustomer(customer) {
  return {
    type: GOT_CUSTOMER,
    customer
  };
}

function fetchCustomer(aid) {
  return (dispatch) => {
    const query = {
      api: "subscribers",
      params: [
        { method: "query" },
        {
          query: JSON.stringify({
            aid,
            type: "account"
          })
        }
      ]
    };

    apiBillRun(query).then(
      success => {
        const customer = success.data[0].data.details[0];
        dispatch(gotCustomer(customer));
      },
      failure => {
        console.log(failure);
      }
    ).catch(
      error => dispatch(apiBillRunErrorHandler(error))
    );
  };
}

export function getCustomer(aid) {
  return dispatch => {
    return dispatch(fetchCustomer(parseInt(aid, 10)));
  };
}

export function clearCustomer() {
  return {
    type: CLEAR_CUSTOMER
  };
}
