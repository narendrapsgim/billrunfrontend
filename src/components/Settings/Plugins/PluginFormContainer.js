import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import PluginForm from './PluginForm';
import { validateFieldByType } from '@/actions/entityActions';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, {
  item, updateField, removeField, setError, ...otherProps
}) => ({

  onChangeEnabled: (e) => {
    const { value } = e.target;
    const newState = value === 'yes';
    updateField('enabled', newState);
  },

  onChange: (key, value) => {
    const path = Array.isArray(key) ? key : [key];
    const pathString = path.join('.');
    const field_config = item
      .getIn(['configuration', 'fields'], List())
      .find(field => field.get('field_name', '') === pathString, null, Map());
    const isValid = validateFieldByType(value, field_config);
    if (isValid !== true) {
      setError(pathString, isValid);
    } else {
      setError(pathString);
    }
    updateField(['configuration', 'values', ...path], value)
  },

  onRemove: (key) => {
    const path = Array.isArray(key) ? key : [key];
    const pathString = path.join('.');
    setError(pathString);
    removeField(['configuration', 'values', ...path]);
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PluginForm);
