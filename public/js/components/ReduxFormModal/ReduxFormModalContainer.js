import { connect } from 'react-redux';
import ReduxFormModal from './ReduxFormModal';
import {
  formModalShowStateSelector,
  formModalItemSelector,
  formModalComponentSelector,
  formModalConfigSelector,
} from '../../selectors/guiSelectors';
import {
  hideFormModal,
  setFormModalItem,
  updateFormModalItemField,
  removeFormModalItemField,
} from '../../actions/guiStateActions/pageActions';


const mapStateToProps = state => ({
  show: formModalShowStateSelector(state),
  item: formModalItemSelector(state),
  component: formModalComponentSelector(state),
  config: formModalConfigSelector(state),
});

const mapDispatchToProps = dispatch => ({
  hideModal: callback => (params) => {
    if (callback && typeof callback === 'function') {
      callback(params);
    }
    dispatch(hideFormModal());
  },
  setItem: (newItem) => {
    dispatch(setFormModalItem(newItem));
  },
  updateField: (path, value) => {
    dispatch(updateFormModalItemField(path, value));
  },
  removeField: (path) => {
    dispatch(removeFormModalItemField(path));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReduxFormModal);
