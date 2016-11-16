import React from 'react';
import Diff from 'react-diff';
import { Modal, Button } from 'react-bootstrap';

const DiffModal = ({ inputA, inputB, title, show, onClose, diffType, closeLabel }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Diff inputA={inputA} inputB={inputB} type={diffType} />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onClose}>{closeLabel}</Button>
    </Modal.Footer>
  </Modal>
);

DiffModal.defaultProps = {
  show: true,
  closeLabel: 'Close',
  diffType: 'json',
  title: 'Diff',
};

DiffModal.propTypes = {
  inputA: React.PropTypes.any.isRequired,
  inputB: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool,
  closeLabel: React.PropTypes.string,
  diffType: React.PropTypes.string,
  title: React.PropTypes.string,
};

export default DiffModal;
