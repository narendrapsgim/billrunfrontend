import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';
import { apiBillRun } from '../common/Api';

export const GOT_DATA = 'GOT_DATA';
export const GOT_DATA_ERROR = 'GOT_DATA_ERROR';

const gotData = (chartId, chartData) => ({
  type: GOT_DATA,
  chartData,
  chartId,
});

const gotDataError = (chartId, chartError) => ({
  type: GOT_DATA_ERROR,
  chartError,
  chartId,
});

export const getData = (chartId, query) => {
  const cacheKey = `dashboard-chart-${chartId}`;
  const cache = JSON.parse(localStorage.getItem(cacheKey));
  if (cache && moment(cache.time).add(5, 'minutes').isAfter(moment())) {
    return dispatch => dispatch(gotData(chartId, cache.data));
  }

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query)
      .then((success) => {
        dispatch(gotData(chartId, success.data));
        const newCache = JSON.stringify({
          time: moment(),
          data: success.data,
        });
        localStorage.setItem(cacheKey, newCache);
        dispatch(finishProgressIndicator());
      })
      .catch((error) => {
        console.log(`Chart ${chartId} error: `, error);
        dispatch(gotDataError(chartId, error));
        dispatch(dismissProgressIndicator());
      });
  };
};
