import React from 'react';
import Diff from 'react-diff';
import { Modal, Button } from 'react-bootstrap';


const CompareModal = props => (
  <Modal show={props.show} onHide={props.onCloseCompare}>
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Diff inputA={props.inputA} inputB={props.inputB} type={props.compareType} />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.onCloseCompare}>{props.closeLabel}</Button>
    </Modal.Footer>
  </Modal>
);

CompareModal.defaultProps = {
  closeLabel: 'Cancel',
  compareType: 'json',
  show: false,
  title: 'Diff',
};

CompareModal.propTypes = {
  closeLabel: React.PropTypes.string,
  compareType: React.PropTypes.string,
  inputA: React.PropTypes.any.isRequired,
  inputB: React.PropTypes.any.isRequired,
  onCloseCompare: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string,
};

export default CompareModal;
