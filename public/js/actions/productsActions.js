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

function fetchProducts(query) {
  let fetchUrl = `/api/find?collection=rates&size=${query.size}&page=${query.page}`;
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

export function getProducts(query = {page: 1, size: 10}) {
  return dispatch => {
    return dispatch(fetchProducts(query));
  };
}
