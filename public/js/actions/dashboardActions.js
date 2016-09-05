export const GOT_DATA = 'GOT_DATA';
export const GOT_DATA_ERROR = 'GOT_DATA_ERROR';

import { showProgressBar, hideProgressBar } from './progressbarActions';
import { apiBillRun } from '../common/Api';

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

export function getData(chartId, query) {
  return (dispatch) => {
    dispatch(showProgressBar());
    apiBillRun(query).then(
      success => {
        dispatch(gotData(chartId, success.data));
        dispatch(hideProgressBar());
      },
      failure => { throw failure }
    ).catch(error => {
      dispatch(gotDataError(chartId, error));
      dispatch(hideProgressBar());
    });
  };
}
