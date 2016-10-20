import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';


const ConfirmModal = (props) => (
  <Modal show={props.show}>
    <Modal.Header closeButton={false}>
      <Modal.Title>{ props.message }</Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button bsSize="small" style={{ minWidth: 90, marginRight: 5 }} onClick={props.onCancel} >{props.labelCancel}</Button>
      <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onOk} bsStyle="primary" >{props.labelOk}</Button>
    </Modal.Footer>
  </Modal>
)

ConfirmModal.defaultProps = {
  show: false,
  labelCancel: 'Cancel',
  labelOk: 'Ok',
}

ConfirmModal.propTypes = {
  show: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onOk: React.PropTypes.func.isRequired,
  labelCancel: React.PropTypes.string,
  labelOk: React.PropTypes.string,
}

export default ConfirmModal;
