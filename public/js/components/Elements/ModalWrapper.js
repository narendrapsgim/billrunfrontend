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
    { (props.onCancel || props.onOk) &&
      <Modal.Footer>
        { props.onCancel && (
          <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onCancel}>
            { props.labelCancel }
          </Button>
        ) }
        { props.onOk && (
          <Button bsSize="small" style={{ minWidth: 90 }} onClick={props.onOk} bsStyle="primary" disabled={props.progress}>
            { props.progress && (<span><i className="fa fa-spinner fa-pulse" />&nbsp;&nbsp;</span>) }
            { (props.progress && props.labelProgress !== null)
              ? props.labelProgress
              : props.labelOk
            }
          </Button>
        ) }
      </Modal.Footer>
    }
  </Modal>
);

ModalWrapper.defaultProps = {
  title: '',
  show: false,
  progress: false,
  labelOk: 'OK',
  labelCancel: 'Cancel',
  labelProgress: null,
};

ModalWrapper.propTypes = {
  children: PropTypes.element,
  labelOk: PropTypes.string,
  labelCancel: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  show: PropTypes.bool.isRequired,
  progress: PropTypes.bool,
  labelProgress: PropTypes.string,
  title: PropTypes.string.isRequired,
  onHide: PropTypes.func,
};

export default ModalWrapper;
