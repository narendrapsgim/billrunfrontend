import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';
import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';

function creditChargeApi(params) {
  const query = {
    api: 'credit',
    params,
  };
  return apiBillRun(query);
}

export function creditCharge(params) { // eslint-disable-line import/prefer-default-export
  return (dispatch) => {
    dispatch(startProgressIndicator());
    return creditChargeApi(params)
    .then(
      () => {
        dispatch(finishProgressIndicator());
        return (true);
      }
    )
    .catch(
      (error) => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(error));
        return (error);
      }
    );
  };
}
