export const GOT_CUSTOMER = 'GOT_CUSTOMER';
export const GOT_CUSTOMERS = 'GOT_CUSTOMERS';
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


function gotCustomers(customers) {
  return {
    type: GOT_CUSTOMERS,
    customers
  }
}

function gotCustomer(customer) {
  return {
    type: GOT_CUSTOMER,
    customer
  }
}

function fetchCustomers() {  
  let fetchUrl = `/api/find?collection=subscribers&query={"type": "account"}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotCustomers(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}


function fetchCustomer(customer_id) {
  let fetchUrl = `/api/find?collection=subscribers&query={"aid": {"$in": ["${customer_id}"]}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      response => {
        dispatch(gotCustomer(customer));
        dispatch(hideProgressBar());
        //dispatch(gotSubscriber(response.data.details));
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}


export function getCustomers() {
  return dispatch => {
    return dispatch(fetchCustomers());
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
