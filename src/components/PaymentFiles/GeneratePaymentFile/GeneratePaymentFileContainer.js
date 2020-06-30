import { connect } from 'react-redux';
import Immutable from 'immutable';
import { showFormModal } from '@/actions/guiStateActions/pageActions';
import { validateGeneratePaymentFile } from '@/actions/paymentFilesActions';
import GeneratePaymentFile from './GeneratePaymentFile';
import GeneratePaymentFileForm from './GeneratePaymentFileFormContainer';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, { data, onGenerate }) => ({
  // eslint-disable-line no-unused-vars

  onClick: () => {
    const onOk = (paymentFile) => {
      if (!dispatch(validateGeneratePaymentFile(paymentFile))) {
        return false;
      }
      onGenerate(paymentFile.get('values', Immutable.Map()));
    };
    const config = {
      title: 'Generate Payment File',
      labelOk: 'Generate Payment File',
      onOk,
    };
    const item = Immutable.Map({ fields: data });    
    return dispatch(showFormModal(item, GeneratePaymentFileForm, config));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GeneratePaymentFile);
