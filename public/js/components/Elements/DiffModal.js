import React from 'react';
import Diff from 'react-diff';
import { Modal, Button } from 'react-bootstrap';


const DiffModal = props => (
  <Modal show={props.show} onHide={props.onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Diff inputA={props.inputA} inputB={props.inputB} type={props.diffType} />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onClose}>{props.closeLabel}</Button>
    </Modal.Footer>
  </Modal>
);

DiffModal.defaultProps = {
  closeLabel: 'Cancel',
  diffType: 'json',
  show: false,
  title: 'Diff',
};

DiffModal.propTypes = {
  closeLabel: React.PropTypes.string,
  diffType: React.PropTypes.string,
  inputA: React.PropTypes.any.isRequired,
  inputB: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string,
};

export default DiffModal;
