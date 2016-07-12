export const GOT_CUSTOMER = 'GOT_CUSTOMER';
export const GOT_CUSTOMERS = 'GOT_CUSTOMERS';
export const UPDATE_SUBSCRIBER_FIELD = 'UPDATE_SUBSCRIBER_FIELD';
export const SAVE_SUBSCRIBER = 'SAVE_SUBSCRIBER';
export const GOT_SUBSCRIBER_SETTINGS = 'GOT_SUBSCRIBER_SETTINGS';
export const GET_NEW_CUSTOMER = 'GET_NEW_CUSTOMER';
export const CLEAR_CUSTOMER = 'CLEAR_CUSTOMER';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

export function saveSubscriber(newCustomer = false) {
  return {
    type: SAVE_SUBSCRIBER,
    newCustomer
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


function fetchCustomer(aid) {
  let fetchUrl = `/api/find?collection=subscribers&query={"aid": ${aid}}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        let customer = _.values(resp.data.details);
        dispatch(gotCustomer(customer));
        dispatch(hideProgressBar());
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

function gotSubscriberSettings(settings) {
  return {
    type: GOT_SUBSCRIBER_SETTINGS,
    settings
  };
}

function fetchSubscriberSettings() {
  let fetchUrl = `/api/settings?category=subscribers&data={}`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotSubscriberSettings(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };  
}

export function getSubscriberSettings() {
  return dispatch => {
    return dispatch(fetchSubscriberSettings());
  };
}

export function updateCustomerField(field_id, value) {
  return {
    type: UPDATE_SUBSCRIBER_FIELD,
    field_id,
    value
  };
}

export function getNewCustomer() {
  return {
    type: GET_NEW_CUSTOMER
  };
}

export function clearCustomer() {
  return {
    type: CLEAR_CUSTOMER
  }
}
