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

function savedCustomer() {
  return {
    type: 'test'
  };
}

export function saveSubscriber(action, data) {
  let saveUrl = '/admin/save';

  var formData = new FormData();
  if (action !== 'new') formData.append('id', data.get('id'));
  formData.append("coll", 'subscribers');
  formData.append("type", action);
  formData.append("data", JSON.stringify(data.toJS()));

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(saveUrl, formData).then(
      resp => {
        dispatch(savedCustomer());
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      console.log(error);
      dispatch(hideProgressBar());
    });
  };    
  /* return {
     type: SAVE_SUBSCRIBER,
     newCustomer
     }; */
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

function fetchCustomers(query) {
  let q = JSON.parse(query.filter);
  q.type = 'account';
  let fetchUrl = `/api/find?collection=subscribers&query=${JSON.stringify(q)}`;
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


export function getCustomers(query = {filter: JSON.stringify({})}) {
  return dispatch => {
    return dispatch(fetchCustomers(query));
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

export function getNewCustomer(aid = false) {
  return {
    type: GET_NEW_CUSTOMER,
    aid
  };
}

export function clearCustomer() {
  return {
    type: CLEAR_CUSTOMER
  }
}
