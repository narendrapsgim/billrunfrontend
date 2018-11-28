import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { ModalWrapper } from '../Elements';

const form = (WrappedComponent, item, setItem, updateField, removeField) => (
  <WrappedComponent
    item={item}
    setItem={setItem}
    updateField={updateField}
    removeField={removeField}
  />
);

const ReduxFormModal = ({ show, item, component, config, hideModal, ...props }) => {
  if (!show) {
    return null;
  }
  if (show && !component) {
    throw new Error('ReduxFormModal require component parameter');
  }

  const title = config.get('title');
  const labelOk = config.get('labelOk', 'Save');
  const onOk = hideModal(config.get('onOk'));
  const labelCancel = config.get('labelCancel', 'Cancel');
  const onCancel = hideModal(config.get('onCancel'));

  return (
    <ModalWrapper
      show={true}
      title={title}
      onOk={() => { onOk(item); }}
      labelOk={labelOk}
      onCancel={onCancel}
      labelCancel={labelCancel}
    >
      {form(component, item, props.setItem, props.updateField, props.removeField)}
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
  setItem: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  removeField: PropTypes.func.isRequired,
};

export default ReduxFormModal;
