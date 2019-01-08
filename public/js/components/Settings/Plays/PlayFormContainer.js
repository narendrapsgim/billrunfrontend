import { connect } from 'react-redux';
import PlayForm from './PlayForm';


const mapStateToProps = (state, props) => ({
  isAllowedDisableAction: !props.item.get('default', false),
  isAllowedEditName: props.mode === 'create',
  isAllowedEditDefault: props.mode === 'create',
});


const mapDispatchToProps = (dispatch, { item, mode, updateField, ...otherProps }) => ({ // eslint-disable-line no-unused-vars

  onChangeName: (e) => {
    const { value } = e.target;
    const cleanValue = value.toUpperCase().replace(globalSetting.keyUppercaseCleanRegex, '');
    updateField(['name'], cleanValue);
  },

  onChangeLabel: (e) => {
    const { value } = e.target;
    updateField('label', value);
  },

  onChangeDefault: (e) => {
    const { value } = e.target;
    updateField('default', value);
    if (value) {
      updateField('enabled', true);
    }
  },

  onChangeEnabled: (e) => {
    const { value } = e.target;
    updateField('enabled', value);
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(PlayForm);
