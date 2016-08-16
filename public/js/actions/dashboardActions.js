export const GOT_DATA = 'GOT_DATA';
export const GOT_DATA_ERROR = 'GOT_DATA_ERROR';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun } from '../Api';

function gotData(chartId, data) {
  return {
    type: GOT_DATA,
    chartId: chartId,
    chartData: data
  };
}

function gotDataError(chartId, error) {
  return {
    type: GOT_DATA_ERROR,
    chartId: chartId,
    chartError: error
  };
}

function fetchData(chartId, query) {
  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then(
      responce => {
        // console.log(responce);
        if(responce.status){
          dispatch(gotData(chartId, responce.data));
        } else {
          dispatch(gotDataError(chartId, responce.data));
        }
        dispatch(hideProgressBar());
      },
      error => {
        // console.log('ERROR : ' , error);
        dispatch(gotDataError(chartId, error));
        dispatch(hideProgressBar());
      }
    ).catch(error => {
      dispatch(gotDataError(chartId, error));
      console.log('Catch ERROR : ' , error);
      dispatch(hideProgressBar());
    });
  };
}

export function getData(type, query) {
  return dispatch => {
    return dispatch(fetchData(type, query));
  };
}
