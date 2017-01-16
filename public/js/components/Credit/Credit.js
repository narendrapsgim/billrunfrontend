import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, FormGroup, HelpBlock, Modal, Form, ControlLabel } from 'react-bootstrap';
import moment from 'moment';
import Field from '../Field';
import { creditCharge } from '../../actions/creditActions';

class Credit extends Component {
  static defaultProps = {
    cancelLabel: 'Cancel',
    chargeLabel: 'Charge',
    sid: false,
  };

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired,
    sid: React.PropTypes.number,
    aid: React.PropTypes.number.isRequired,
    cancelLabel: React.PropTypes.string,
    chargeLabel: React.PropTypes.string,
  };

  state = {
    paramKeyError: '',
    rateBy: 'fix',
    aprice: 0,
    usagev: 0,
    usaget: '',
    rate: '',
  }

  onChangeCreditValue = (field, e) => {
    const { value } = e.target;
    const newState = {};
    newState[field] = value;
    this.setState(newState);
  };

  onChangeCreditBy = (e) => {
    const { value } = e.target;
    this.setState({ rateBy: value });
  }

  onCreditCharge = () => {
    const { aid, sid } = this.props;
    const { rateBy, aprice, usagev, usaget, rate, paramKeyError } = this.state;
    let params = [
      { aid },
      { sid },
      { rate },
      { time: moment().unix() },
    ];
    if (rateBy === 'fix') {
      params = [...params, { aprice }];
    } else {
      params = [...params, { usagev }, { usaget }];
    }
    this.props.dispatch(creditCharge(params))
    .then(
      (s) => {
        //TODO: success message
        console.log(s);
      }
    );
  };

  getAvailableRates = () => {
    const rates = ['test_rate', 'rate1', 'rate2', 'rate3']; //TODO: get real rates
    return [
      (<option disabled value="" key={-1}>Select Rate...</option>),
      ...rates.map(rate => (<option value={rate} key={rate}>{rate}</option>)),
    ];
  }

  render() {
    const { cancelLabel, chargeLabel } = this.props;
    const { rateBy, aprice, usagev, usaget, rate, paramKeyError } = this.state;
    const availableRates = this.getAvailableRates();
    return (
      <Modal show={true}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Credit Charge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>Rate By</Col>
              <Col sm={10}>
                <input
                  type="radio"
                  name="rate-by"
                  id="rate-by-fix"
                  value="fix"
                  checked={rateBy === 'fix'}
                  onChange={this.onChangeCreditBy}
                />
                <label htmlFor="rate-by-fix">fix price</label>
                <input
                  type="radio"
                  name="rate-by"
                  id="rate-by-usagev"
                  value="usagev"
                  checked={rateBy === 'usagev'}
                  onChange={this.onChangeCreditBy}
                />
                <label htmlFor="rate-by-usagev">volume</label>
              </Col>
            </FormGroup>

            <FormGroup validationState={paramKeyError.length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Price</Col>
              <Col sm={10}>
                <Field
                  onChange={this.onChangeCreditValue.bind(this, 'aprice')}
                  value={aprice}
                  fieldType="price"
                  disabled={rateBy !== 'fix'}
                />
                { paramKeyError.length > 0 ? <HelpBlock>{paramKeyError}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={paramKeyError.length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Volume</Col>
              <Col sm={10}>
                <Field
                  onChange={this.onChangeCreditValue.bind(this, 'usagev')}
                  value={usagev}
                  fieldType="number"
                  disabled={rateBy !== 'usagev'}
                />
                { paramKeyError.length > 0 ? <HelpBlock>{paramKeyError}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={paramKeyError.length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Unit Type</Col>
              <Col sm={10}>
                <Field
                  onChange={this.onChangeCreditValue.bind(this, 'usaget')}
                  value={usaget}
                  disabled={rateBy !== 'usagev'}
                />
                { paramKeyError.length > 0 ? <HelpBlock>{paramKeyError}</HelpBlock> : ''}
              </Col>
            </FormGroup>

            <FormGroup validationState={paramKeyError.length > 0 ? 'error' : null}>
              <Col sm={2} componentClass={ControlLabel}>Rate</Col>
              <Col sm={10}>
                <select
                  id="rate"
                  className="form-control"
                  onChange={this.onChangeCreditValue.bind(this, 'rate')}
                  value={rate}
                >
                  { availableRates }
                </select>
                { paramKeyError.length > 0 ? <HelpBlock>{paramKeyError}</HelpBlock> : ''}
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" onClick={this.props.onClose}>{cancelLabel}</Button>
          <Button bsSize="small" onClick={this.onCreditCharge} bsStyle="primary" >{chargeLabel}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect()(Credit);
