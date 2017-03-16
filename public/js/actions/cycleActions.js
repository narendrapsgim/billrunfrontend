import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { getRunCycleQuery, getConfirmCycleInvoiceQuery, getConfirmCycleAllQuery } from '../common/ApiQueries';
import { startProgressIndicator } from './progressIndicatorActions';

export const runBillingCycle = (billrunKey, rerun = false) => (dispatch) => { // eslint-disable-line import/prefer-default-export
  dispatch(startProgressIndicator());
  const query = getRunCycleQuery(billrunKey, rerun);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Cycle started successfully!')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error running cycle')));
};

export const confirmCycleInvoice = (billrunKey, invoiceId) => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getConfirmCycleInvoiceQuery(billrunKey, invoiceId);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Invoice confirmed!')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error confirming invoice')));
};

export const confirmCycle = billrunKey => (dispatch) => {
  dispatch(startProgressIndicator());
  const query = getConfirmCycleAllQuery(billrunKey);
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, 'Cycle confirmed!')))
    .catch(error => dispatch(apiBillRunErrorHandler(error, 'Error confirming cycle')));
};
