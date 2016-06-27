export const GOT_CUSTOMER = 'GOT_CUSTOMER';
export const UPDATE_SUBSCRIBER_FIELD = 'UPDATE_SUBSCRIBER_FIELD';
export const SAVE_SUBSCRIBER = 'SAVE_SUBSCRIBER';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function saveSubscriber() {
  return {
    type: SAVE_SUBSCRIBER
  };
}

function gotCustomer(customer) {
  return {
    type: GOT_CUSTOMER,
    customer
  }
}

function fetchCustomer(customer_id) {
  /** TODO: REMOVE **/
  let customer = [
    {
      first_name: "Lewis",
      last_name: "Nitzberg",
      aid: 123123,
      address: "1516 Lilac lane, Mountain View, CA",
      type: "account"
    },
    {
      plan: "Fish o' the Month",
      plan_ref: "123eab",
      aid: 123123,
      sid: 111111
    },
    {
      plan: "Steak o' the Month",
      plan_ref: "422eaa",
      aid: 123123,
      sid: 222222
    }
  ];
  
  let fetchUrl = `/api/find?collection=customers&query={"aid": {"$in": ["${customer_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      response => {
        dispatch(gotCustomer(customer));
        dispatch(hideProgressBar());
        //dispatch(gotSubscriber(response.data.details));
      }
    ).catch(error => {
      /** TODO: Remove and error handle **/
      dispatch(gotCustomer(customer));
      dispatch(hideProgressBar());
    });
  };
}

export function getCustomer(customer_id) {
  return dispatch => {
    return dispatch(fetchCustomer(customer_id));
  };
}

export function updateCustomerField(field_id, value) {
  return {
    type: UPDATE_SUBSCRIBER_FIELD,
    field_id,
    value
  };
}
