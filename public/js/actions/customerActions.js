export const GOT_CUSTOMERS = 'GOT_CUSTOMERS';
export const UPDATE_CUSTOMER_FIELD = 'UPDATE_CUSTOMER_FIELD';
export const SAVE_SUBSCRIBER = 'SAVE_SUBSCRIBER';
export const GOT_SUBSCRIBER_SETTINGS = 'GOT_SUBSCRIBER_SETTINGS';
export const CLEAR_CUSTOMER = 'CLEAR_CUSTOMER';

import axios from 'axios';
import Immutable from 'immutable';
import moment from 'moment';
import { showProgressBar, hideProgressBar } from './progressbarActions';
import { showModal } from './modalActions';

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
  let saveUrl;

  if (data.get('aid')) {
    saveUrl = `/api/subscribers?method=update&type=account&query={"aid": ${data.get('aid')}}&update=${JSON.stringify(data.toJS())}`;
  } else {
    saveUrl = `/api/subscribers?method=create&type=account&subscriber=${JSON.stringify(data.toJS())}`;
  }

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.post(saveUrl).then(
      resp => {
        dispatch(savedCustomer());
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
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

function fetchCustomers(query) {
  let sort = query.sort ? `&sort={"${query.sort}":1}` : '';
  let size = query.size ? `&size=${query.size}` : '';
  let page = query.page ? `&page=${query.page}` : '';
  let q = query.filter ? `&query=${query.filter}` : '';
  let fetchUrl = `/api/find?collection=subscribers&${size}${sort}${page}${q}`;

  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotCustomers(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(showModal(error.data.message, "Error!"));
      dispatch(hideProgressBar());
    });
  };
}

export function getCustomers(query = {page: 0, size: 10, filter: "", sort: ""}) {
  return dispatch => {
    return dispatch(fetchCustomers(query));
  };
}

export function clearCustomer() {
  return {
    type: CLEAR_CUSTOMER
  }
}
