import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';


const ConfirmModal = props => (
  <Modal show={props.show}>
    <Modal.Header closeButton={false}>
      <Modal.Title>{ props.message }</Modal.Title>
    </Modal.Header>
    { props.children &&
      <Modal.Body>
        { props.children }
      </Modal.Body>
    }
    <Modal.Footer>
      <Button bsSize="small" style={{ minWidth: 90, marginRight: 5 }} onClick={props.onCancel} >{props.labelCancel}</Button>
      <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onOk} bsStyle="primary" >{props.labelOk}</Button>
    </Modal.Footer>
  </Modal>
);

ConfirmModal.defaultProps = {
  children: null,
  labelCancel: 'Cancel',
  labelOk: 'Ok',
  show: false,
};

ConfirmModal.propTypes = {
  children: PropTypes.element,
  labelCancel: PropTypes.string,
  labelOk: PropTypes.string,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default ConfirmModal;
