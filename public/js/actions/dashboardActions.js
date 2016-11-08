import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';
import { apiBillRun } from '../common/Api';

export const GOT_DATA = 'GOT_DATA';
export const GOT_DATA_ERROR = 'GOT_DATA_ERROR';

function gotData(chartId, chartData) {
  return {
    type: GOT_DATA,
    chartData,
    chartId,
  };
}

function gotDataError(chartId, chartError) {
  return {
    type: GOT_DATA_ERROR,
    chartError,
    chartId,
  };
}

export function getData(chartId, query) {
  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      (success) => {
        dispatch(gotData(chartId, success.data));
        dispatch(finishProgressIndicator());
      },
      (failure) => { throw failure; }
    ).catch((error) => {
      console.log(`Chart ${chartId} error: `, error);
      dispatch(gotDataError(chartId, error));
      dispatch(dismissProgressIndicator());
    });
  };
}
