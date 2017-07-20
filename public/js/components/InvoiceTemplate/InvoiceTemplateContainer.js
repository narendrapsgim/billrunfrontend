import { connect } from 'react-redux';
import { getSettings, saveSettings, updateSetting } from '../../actions/settingsActions';
import { showConfirmModal } from '../../actions/guiStateActions/pageActions';
import {
  invoiceTemplateHeaderSelector,
  invoiceTemplateFooterSelector,
  invoiceTemplateSuggestionsSelector,
  invoiceTemplateTemplatesSelector,
} from '../../selectors/settingsSelector';
import InvoceBlock from './InvoiceTemplate';

const mapStateToProps = (state, props) => ({
  header: invoiceTemplateHeaderSelector(state, props),
  footer: invoiceTemplateFooterSelector(state, props),
  suggestions: invoiceTemplateSuggestionsSelector(state),
  templates: invoiceTemplateTemplatesSelector(state),
});

const mapDispatchToProps = dispatch => ({
  getData: () => {
    dispatch(getSettings('invoice_export'));
  },
  onChange: (templateName, content) => {
    dispatch(updateSetting('invoice_export', templateName, content));
  },
  onSave: () => {
    const afterSave = (response) => {
      if (response && response.status === 1) {
        dispatch(getSettings('invoice_export'));
      }
    };
    dispatch(saveSettings('invoice_export')).then(afterSave);
  },
  onCancel: () => {
    const getData = () => { dispatch(getSettings('invoice_export')); };
    const confirm = {
      message: 'Are you sure you want to discard editing Invoice Template?',
      onOk: getData,
      labelOk: 'Discard',
      type: 'delete',
    };
    dispatch(showConfirmModal(confirm));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoceBlock);
