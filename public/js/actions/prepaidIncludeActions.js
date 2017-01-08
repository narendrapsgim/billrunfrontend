import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

function savePrepaidIncludeToDB(prepaidInclude, action, callback) {
  const formData = new FormData();
  formData.append('new_entity', action === 'new');
  formData.append('data', JSON.stringify(prepaidInclude));

  return (dispatch) => {
    dispatch(startProgressIndicator());
    const query = {
      api: 'savePPIncludes',
      options: {
        method: 'POST',
        body: formData,
      },
    };
    apiBillRun(query).then(
      () => {
        dispatch(finishProgressIndicator());
        callback(true);
      },
      (failure) => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(failure));
      }
    ).catch(
      (error) => {
        dispatch(finishProgressIndicator());
        dispatch(apiBillRunErrorHandler(error));
      }
    );
  };
}

export function savePrepaidInclude(prepaid_include, action, callback = () => {}) {
  return (dispatch) => {
    return dispatch(savePrepaidIncludeToDB(prepaid_include, action, callback));
  };
}
