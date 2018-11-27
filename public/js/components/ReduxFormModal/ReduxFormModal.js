import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { ModalWrapper } from '../Elements';
import {
  hideFormModal,
  setFormModalItem,
  updateFormModalItemField,
  removeFormModalItemField,
} from '../../actions/guiStateActions/pageActions';
import {
  formModalShowStateSelector,
  formModalItemSelector,
  formModalComponentSelector,
  formModalConfigSelector,
} from '../../selectors/guiSelectors';


const ReduxFormModal = ({ show, item, component, config, dispatch }) => {
  if (!show || !component) {
    return null;
  }

  const hideModal = callback => (params) => {
    if (callback && typeof callback === 'function') {
      callback(params);
    }
    dispatch(hideFormModal());
  };

  const title = config.get('title');
  const labelOk = config.get('labelOk', 'Save');
  const onOk = hideModal(config.get('onOk'));
  const labelCancel = config.get('labelCancel', 'Cancel');
  const onCancel = hideModal(config.get('onCancel'));

  const onClickOk = () => {
    onOk(item);
  };
  const form = (WrappedItemFormComponent) => {
    const setItem = (newItem) => {
      dispatch(setFormModalItem(newItem));
    };
    const updateField = (path, value) => {
      dispatch(updateFormModalItemField(path, value));
    };
    const removeField = (path) => {
      dispatch(removeFormModalItemField(path));
    };
    return (
      <WrappedItemFormComponent
        item={item}
        setItem={setItem}
        updateField={updateField}
        removeField={removeField}
      />
    );
  };

  return (
    <ModalWrapper
      show={true}
      title={title}
      onOk={onClickOk}
      labelOk={labelOk}
      onCancel={onCancel}
      labelCancel={labelCancel}
    >
      {form(component)}
    </ModalWrapper>
  );
};

ReduxFormModal.defaultProps = {
  show: false,
  item: undefined,
  component: undefined,
  config: Immutable.Map(),
};

ReduxFormModal.propTypes = {
  show: PropTypes.bool,
  item: PropTypes.instanceOf(Immutable.Map),
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  config: PropTypes.instanceOf(Immutable.Map),
  dispatch: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  show: formModalShowStateSelector(state),
  item: formModalItemSelector(state),
  component: formModalComponentSelector(state),
  config: formModalConfigSelector(state),
});

export default connect(mapStateToProps)(ReduxFormModal);
