import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Modal, Button} from 'react-bootstrap';

import {
  toggleDeleteConfirm
} from '../../actions/guiStateActions/deleteConfirmAction';


class ConfirmDelete extends Component {
  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  close() {
    this.props.toggleDeleteConfirm();
  }
  confirmDelete () {
    if (this.props.onConfirm) {
      this.onConfirm();
    }
    this.props.toggleDeleteConfirm();

  }

  render() {
    const {isShow, desc} = this.props;

    return (
      <Modal show={isShow} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{desc}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Cancel</Button>
          <Button  bsStyle="danger" onClick={this.confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    toggleDeleteConfirm
  }, dispatch);
}

function mapStateToProps(state, props) {
  return {isShow: state.guiState.deleteConfirmShow.get('isShow'),
          desc: state.guiState.deleteConfirmShow.get('desc')};
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDelete);
