import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import GeneratePaymentFileForm from './GeneratePaymentFileForm';
import { validateFieldByType } from '@/actions/entityActions';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, {
  data, updateField, setError
}) => ({


  onChange: (key, value) => {
				debugger;
    const path = Array.isArray(key) ? key : [key];
    const pathString = path.join('.');
    const field_config = data.find(field => field.get('field_name', '') === pathString, null, Map());
    const hasError = validateFieldByType(value, field_config);
    if (hasError !== false) {
      setError(pathString, hasError);
    } else {
      setError(pathString);
    }
    updateField(...path, value)
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(GeneratePaymentFileForm);
