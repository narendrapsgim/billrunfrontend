import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import GeneratePaymentFileForm from './GeneratePaymentFileForm';
import { validateFieldByType } from '@/actions/entityActions';
import Immutable from 'immutable';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, {
  item, updateField, setError
}) => ({


  onChange: (key, value) => {
    const path = Array.isArray(key) ? key : [key];
    const pathString = path.join('.');
    const field_config = item.get('fields', Immutable.List()).find(field => field.get('field_name', '') === pathString, null, Map());
    const hasError = validateFieldByType(value, field_config);
    if (hasError !== false) {
      setError(pathString, hasError);
    } else {
      setError(pathString);
    }
    updateField(['values',	...path], value)
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GeneratePaymentFileForm);
