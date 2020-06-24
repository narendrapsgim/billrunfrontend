import { connect } from 'react-redux';
import {
  showFormModal,
} from '@/actions/guiStateActions/pageActions';
import { validateGeneratePaymentFile } from '@/actions/generatePaymentFileActions';
import GeneratePaymentFile from './GeneratePaymentFile';
import GeneratePaymentFileForm from './GeneratePaymentFileFormContainer';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, { data, onGenerate }) => ({ // eslint-disable-line no-unused-vars

  onClick: () => {
    const onOk = (generateValues) => {
      if (!dispatch(validateGeneratePaymentFile(data, generateValues))) {
        return false;
      }
      onGenerate(generateValues);
    };
    const config = {
      title: 'Generate Payment File',
      onOk,
    };
    return dispatch(showFormModal(data, GeneratePaymentFileForm , config));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneratePaymentFile);
