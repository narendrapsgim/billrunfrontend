import { startProgressIndicator, stopProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

function savePrepaidIncludeToDB(prepaid_include, action, callback) {
  const formData = new FormData();
  formData.append('new_entity', action === 'new');
  formData.append('data', JSON.stringify(prepaid_include));
  
  const query = {
    pre: "admin",
    api: "savePPIncludes",
    options: {
      method: "POST",
      body: formData
    }
  };

  return (dispatch) => {
    dispatch(startProgressIndicator());
    apiBillRun(query).then(
      success => {
        dispatch(finishProgressIndicator());
        console.log('success', success);
        callback(true);
      },
      failure => {
        dispatch(finishProgressIndicator());
        callback(failure);
      }
    ).catch(
      error => {
        apiBillRunErrorHandler(error);
        callback(error);
      }
    );
  };
}

export function savePrepaidInclude(prepaid_include, action, callback = () => {}) {
  return (dispatch) => {
    return dispatch(savePrepaidIncludeToDB(prepaid_include, action, callback));
  };
}
