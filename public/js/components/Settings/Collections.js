import React, { Component } from 'react';

import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

export default class Collections extends Component {
  constructor(props) {
    super(props);

    this.onClickEditEmail = this.onClickEditEmail.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);

    this.state = {
      showModal: false,
      email: "",
      which: ''
    };
  }

  componentWillReceiveProps(props) {
    if (!props.data) return;
    this.setState({email: props.data.get('invoice_overdue_email')});
  }
  
  onClickEditEmail(which, e) {
    this.setState({showModal: true, which});
  }
  
  closeModal() {
    this.setState({showModal: false});
  }

  onSave() {
    this.setState({showModal: false});
  }

  onCancel() {
    this.closeModal();
  }

  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }
  
  render() {
    let invoice_overdue_options =["Within 3 days", "Within a week"].map((op, key) => (
      <option value={op} key={key}>{op}</option>
    ));

    let { onChange, data } = this.props;

    return (
      <div className="CollectionSettings contents" style={{border: "1px solid #C0C0C0", padding: "45px"}}>
        <div className="InvoiceOverdue">
          <div className="row">
            <div className="col-md-4">
              <strong>Invoice Overdue</strong>
            </div>
          </div>
          <div className="row">
            <div className="col-md-1">
              <label for="InvoiceOverdue">1st Warning Email</label>
              <select className="form-control" id="first_invoice_overdue" value={data.get('first_invoice_overdue')} onChange={onChange}>
                { invoice_overdue_options }
              </select>
            </div>
            <div className="col-md-1 col-md-offset-2">
              <label for="InvoiceOverdue">Last Warning Email</label>
              <select className="form-control" id="last_invoice_overdue" value={data.get('last_invoice_overdue')} onChange={onChange}>
                { invoice_overdue_options }
              </select>
            </div>
          </div>
          <div className="row" style={{marginTop: "12px"}}>
            <div className="col-md-3">
              <button type="button" className="btn btn-primary" onClick={this.onClickEditEmail.bind('first')}>Edit Email</button>
            </div>
            <div className="col-md-3">
              <button type="button" className="btn btn-primary" onClick={this.onClickEditEmail.bind('last')}>Edit Email</button>
            </div>
          </div>
        </div>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
            Edit Notification Email
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea class="form-control" onChange={this.handleEmailChange} style={{width: 563, height: 350}}></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onCancel} bsStyle="danger">Cancel</Button>
            <Button onClick={this.onSave} bsStyle="primary">Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
