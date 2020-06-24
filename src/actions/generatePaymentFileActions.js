import { List, Map } from 'immutable';
import { validateMandatoryField } from '@/actions/entityActions';
import { setFormModalError } from './guiStateActions/pageActions';

export const validateGeneratePaymentFile = (data, generateValues) => (dispatch) => {

  let isPluginValid = true;
  data.forEach(field => {
    if (field.get('display', false) && field.get('editable', false)) {
      const path = field.get('field_name', '');
      const path_array = path.split('.').filter(part => part !== '');
      if (generateValues.hasIn(path_array)) {
        const value = generateValues.getIn(path_array)
        const hasError = validateMandatoryField(value, field)
        if (hasError !== false) {
          isPluginValid = false;
          dispatch(setFormModalError(path, hasError));
        }
      }
    }
  });
  return isPluginValid;
}