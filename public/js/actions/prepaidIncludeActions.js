import { startProgressIndicator, finishProgressIndicator } from './progressIndicatorActions';
import { apiBillRun, apiBillRunErrorHandler } from '../common/Api';

import $ from 'jquery';

function savePrepaidIncludeToDB(prepaid_include, action, callback) {
  const formData = new FormData();
  formData.append('new_entity', action === 'new');
//  formData.append('data', prepaid_include.toJS());

  return (dispatch) => {
    dispatch(startProgressIndicator());
    $.ajax({
      method: "POST",
      url: "/admin/savePPIncludes",
      data: {
        new_entity: action === 'new',
        data: prepaid_include.toJS()
      },
      success: () => {
        dispatch(finishProgressIndicator());
        callback(true);
      },
      error: (data) => {
        console.log("ERROR!", data);
        callback(false);
      }
    });
    dispatch(finishProgressIndicator());
  }
}

export function savePrepaidInclude(prepaid_include, action, callback = () => {}) {
  return (dispatch) => {
    return dispatch(savePrepaidIncludeToDB(prepaid_include, action, callback));
  };
}
