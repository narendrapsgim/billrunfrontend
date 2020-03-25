import { connect } from 'react-redux';
import PluginForm from './PluginForm';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, {updateField, removeField}) => ({

  onChangeEnabled: (e) => {
    const { value } = e.target;
    const newState = value === 'yes';
    updateField('enabled', newState);
  },

  onChange: (key, value) => {
    const path = Array.isArray(key) ? key : [key];
    updateField(['configuration', 'values', ...path], value)
  },

  onRemove: (key) => {
    const path = Array.isArray(key) ? key : [key];
    removeField(['configuration', 'values', ...path]);
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PluginForm);
