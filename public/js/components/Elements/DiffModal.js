import React from 'react';
import Diff from 'react-diff';
import { Modal, Button } from 'react-bootstrap';

const DiffModal = ({ inputNew, inputOld, title, show, onClose, diffType, closeLabel }) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Diff inputA={inputOld} inputB={inputNew} type={diffType} />
    </Modal.Body>
    <Modal.Footer>
      <div className="push-left" style={{ width: '50%', display: 'inline-block' }}>
        <p className="text-center" style={{ backgroundColor: 'salmon', marginBottom: 5 }}> Old value </p>
        <p className="text-center" style={{ backgroundColor: 'lightgreen', marginBottom: 5 }}> New value </p>
      </div>
      <div className="push-right" style={{ width: '50%', display: 'inline-block' }}>
        <Button onClick={onClose}>{closeLabel}</Button>
      </div>
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
  inputNew: React.PropTypes.any.isRequired,
  inputOld: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool,
  closeLabel: React.PropTypes.string,
  diffType: React.PropTypes.string,
  title: React.PropTypes.string,
};

export default DiffModal;
