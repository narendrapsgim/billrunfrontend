import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { ModalWrapper } from '../Elements';

const form = (WrappedComponent, item, setItem, updateField, removeField, otherProps = {}) => (
  <WrappedComponent
    {...otherProps}
    item={item}
    setItem={setItem}
    updateField={updateField}
    removeField={removeField}
  />
);

const ReduxFormModal = (props) => {
  const {
    show, item, component, config, // variabls
    hideModal, closeModal, setItem, updateField, removeField, // functions
    ...otherProps // all othet to pass down
  } = props;
  if (!show) {
    return null;
  }
  if (show && !component) {
    throw new Error('ReduxFormModal require component parameter');
  }
  const {
    title, labelOk = 'Save', onOk, labelCancel = 'Cancel', onCancel, modalSize = 'large', ...configOtherProps
  } = config.toJS();
  const onOkWithHide = () => {
    const callback = hideModal(onOk);
    return callback(item);
  };
  const onCancelWithHide = hideModal(onCancel);
  return (
    <ModalWrapper
      show={true}
      title={title}
      onOk={onOkWithHide}
      labelOk={labelOk}
      onCancel={onCancelWithHide}
      labelCancel={labelCancel}
      onHide={closeModal}
      modalSize={modalSize}
    >
      {form(
        component,
        item,
        setItem,
        updateField,
        removeField,
        { ...otherProps, ...configOtherProps },
      )}
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
  hideModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  setItem: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired,
};

export default ReduxFormModal;
