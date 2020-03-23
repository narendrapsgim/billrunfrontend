import { connect } from 'react-redux';
import PluginForm from './PluginForm';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, props) => ({

  onChangeEnabled: (e) => {
    const { updateField } = props;
    const { value } = e.target;
    updateField('enabled', value);
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PluginForm);
