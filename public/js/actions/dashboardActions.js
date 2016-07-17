export const GOT_DATA = 'GOT_DATA';
export const GOT_DATA_ERROR = 'GOT_DATA_ERROR';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun } from '../Api';

function gotData(data) {
  return {
    type: GOT_DATA,
    chart_id: data.type,
    chart_data: data.data
  };
}

function gotDataError(data) {
  return {
    type: GOT_DATA_ERROR,
    chart_id: data.type,
    chart_error: data.error
  };
}

function fetchData(query) {
  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then(
      responce => {
        // console.log(responce);
        dispatch(gotData(responce));
        dispatch(hideProgressBar());
      },
      error => {
        // console.log('ERROR : ' , error);
        dispatch(gotDataError(error));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(gotDataError(error));
      console.log('Catch ERROR : ' , error);
      dispatch(hideProgressBar());
    });
  };
}

export function getData(query) {
  return dispatch => {
    return dispatch(fetchData(query));
  };
}
