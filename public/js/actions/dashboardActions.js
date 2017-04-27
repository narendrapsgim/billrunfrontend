import moment from 'moment';
import { startProgressIndicator, finishProgressIndicator, dismissProgressIndicator } from './progressIndicatorActions';
import { apiBillRun } from '../common/Api';
import { getDashboardQuery } from '../common/ApiQueries';

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
        const data = success.data[0].data.details;
        dispatch(gotData(chartId, data));
        const newCache = JSON.stringify({
          time: moment(),
          data,
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

export const getTotalRevenue = key =>
  getData(key, getDashboardQuery('totalRevenue'));

export const getOutstandingDebt = key =>
  getData(key, getDashboardQuery('outstandingDebt'));

export const getTotalNumOfCustomers = key =>
  getData(key, getDashboardQuery('totalNumOfCustomers'));

export const getCustomerStateDistribution = key =>
  getData(key, getDashboardQuery('customerStateDistribution'));

export const getRevenueOverTime = key =>
  getData(key, getDashboardQuery('revenueOverTime'));

export const getRevenueByPlan = key =>
  getData(key, getDashboardQuery('revenueByPlan'));

export const getAgingDebt = key =>
  getData(key, getDashboardQuery('agingDebt'));

export const getDebtOverTime = key =>
  getData(key, getDashboardQuery('debtOverTime'));

export const getPlanByCustomers = key =>
  getData(key, getDashboardQuery('planByCustomers'));
