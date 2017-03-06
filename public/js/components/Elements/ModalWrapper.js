import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';


const ModalWrapper = props => (
  <Modal show={props.show}>
    <Modal.Header closeButton={props.onHide ? true : false} onHide={props.onHide}>
      <Modal.Title>{ props.title }</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      { props.children }
    </Modal.Body>
    <Modal.Footer>
      { props.onCancel && <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onCancel}>{props.labelCancel}</Button> }
      { props.onOk && <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onOk} bsStyle="primary" >{props.labelOk}</Button> }
    </Modal.Footer>
  </Modal>
);

ModalWrapper.defaultProps = {
  title: 'Edit',
  show: false,
  labelOk: 'OK',
  labelCancel: 'Cancel',
};

ModalWrapper.propTypes = {
  children: PropTypes.element,
  labelOk: PropTypes.string,
  labelCancel: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func,
};

export default ModalWrapper;
