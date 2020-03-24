import { connect } from 'react-redux';
import PluginForm from './PluginForm';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, props) => ({

  onChangeEnabled: (e) => {
    const { updateField } = props;
    const { value } = e.target;
    updateField('enabled', value);
  },

  onChange: (key, value) => {
    const { updateField } = props;
    const path = Array.isArray(key) ? key : [key];
    updateField(['configuration', 'values', ...path], value)
  },

  onRemove: (key) => {
    const { removeField } = props;
    const path = Array.isArray(key) ? key : [key];
    removeField(['configuration', 'values', ...path]);
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PluginForm);
