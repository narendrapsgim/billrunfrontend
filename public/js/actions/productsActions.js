export const GOT_PRODUCTS = 'GOT_PRODUCTS';

import axios from 'axios';
import { showProgressBar, hideProgressBar } from './progressbarActions';

let axiosInstance = axios.create({
  withCredentials: true,
  baseURL: globalSetting.serverUrl
});

function gotProducts(products) {
  return {
    type: GOT_PRODUCTS,
    products
  };
}

function fetchProducts() {
  let fetchUrl = `/api/find?collection=rates`;
  return (dispatch) => {
    dispatch(showProgressBar());
    let request = axiosInstance.get(fetchUrl).then(
      resp => {
        dispatch(gotProducts(resp.data.details));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(hideProgressBar());
    });
  };
}

export function getProducts() {
  return dispatch => {
    return dispatch(fetchProducts());
  };
}
