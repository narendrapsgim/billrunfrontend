import { List, Map } from 'immutable';
import { validateMandatoryField } from '@/actions/entityActions';
import { setFormModalError } from './guiStateActions/pageActions';
import { getList, clearList } from '@/actions/listActions';
import { clearList as entityClearList } from '@/actions/entityListActions';
import { apiBillRun, apiBillRunErrorHandler, apiBillRunSuccessHandler } from '../common/Api';
import { runningPaymentFilesListQuery, sendGenerateNewFileQuery } from '@/common/ApiQueries';


export const getRunningPaymentFiles = (paymentGateway, fileType) => (dispatch) => 
  dispatch(getList('payment_running_files_list', runningPaymentFilesListQuery(paymentGateway, fileType)));

export const cleanRunningPaymentFiles = () => (dispatch) => 
  dispatch(clearList('payment_running_files_list'));

export const cleanPaymentFilesTable = () => (dispatch) => 
  dispatch(entityClearList('payments_files'));

export const validateGeneratePaymentFile = (paymentFile) => (dispatch) => {
  let isValid = true;
	const values = paymentFile.get('values', Map());
  const data = paymentFile.get('fields', List());
  data.forEach(field => {
    if (field.get('display', false) && field.get('editable', false)) {
      const path = field.get('field_name', '');
      const path_array = path.split('.').filter(part => part !== '');
      if (values.hasIn(path_array)) {
        const value = values.getIn(path_array)
        const hasError = validateMandatoryField(value, field)
        if (hasError !== true) {
          isValid = false;
          dispatch(setFormModalError(path, hasError));
        }
      }
    }
  });
  return isValid;
}

export const sendGenerateNewFile = (paymentGateway, fileType, data) => (dispatch) => {
  const query = sendGenerateNewFileQuery(paymentGateway, fileType, data);
  const successMessage = 'File successfully sent, new file record will be updated in the table in a few seconds';
  return apiBillRun(query)
    .then(success => dispatch(apiBillRunSuccessHandler(success, successMessage)))
    .catch(error => {
      dispatch(apiBillRunErrorHandler(error, 'Error'));
      return Promise.reject();
    });
}