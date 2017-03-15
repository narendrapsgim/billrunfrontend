import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getRunCycleQuery } from '../common/ApiQueries';
import { startProgressIndicator } from './progressIndicatorActions';

export const runBillingCycle = (billrunKey, rerun = false) => (dispatch) => { // eslint-disable-line import/prefer-default-export
  dispatch(startProgressIndicator());
  const query = getRunCycleQuery(billrunKey, rerun);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Cycle started successfully!')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error running cycle')));
};
