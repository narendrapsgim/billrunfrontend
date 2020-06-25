import { List, Map } from 'immutable';
import { validateMandatoryField } from '@/actions/entityActions';
import { setFormModalError } from './guiStateActions/pageActions';

export const validateGeneratePaymentFile = (paymentFile) => (dispatch) => {

  let isPluginValid = true;
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
          isPluginValid = false;
          dispatch(setFormModalError(path, hasError));
        }
      }
    }
  });
  return isPluginValid;
}