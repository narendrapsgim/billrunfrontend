import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import moment from 'moment';
import { Map, List } from 'immutable';
import { Col, FormGroup, HelpBlock, Form, ControlLabel } from 'react-bootstrap';
import ModalWrapper from '../Elements/ModalWrapper';
import Field from '../Field';
import { getProductsKeysQuery } from '../../common/ApiQueries';
import { getList } from '../../actions/listActions';
import { getSettings } from '../../actions/settingsActions';
import { creditCharge } from '../../actions/creditActions';

class Credit extends Component {
  static defaultProps = {
    allRates: List(),
    usageTypes: List(),
    sid: false,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    allRates: PropTypes.instanceOf(List),
    usageTypes: PropTypes.instanceOf(List),
    onClose: PropTypes.func.isRequired,
    sid: PropTypes.number,
    aid: PropTypes.number.isRequired,
  };

  state = {
    validationErrors: Map({
      aprice: 'required',
      usagev: '',
      usaget: '',
      rate: 'required',
    }),
    paramKeyError: '',
    rateBy: 'fix',
    aprice: '',
    usagev: '',
    usaget: '',
    rate: '',
    progress: false,
  }

  componentDidMount() {
    this.props.dispatch(getList('all_rates', getProductsKeysQuery()));
    this.props.dispatch(getSettings('usage_types'));
  }

  onChangeValue = (field, value) => {
    const { validationErrors } = this.state;
    const newState = {};
    newState[field] = value;
    if (value.length === 0) {
      newState.validationErrors = validationErrors.set(field, 'required');
    } else {
      newState.validationErrors = validationErrors.set(field, '');
    }
    this.setState(newState);
  };

  onChangeCreditValue = (field, e) => {
    const { value } = e.target;
    this.onChangeValue(field, value);
  };

  onChangeSelectValue = (field, value) => {
    this.onChangeValue(field, value);
  }

  onChangeCreditBy = (e) => {
    const { value } = e.target;
    const { validationErrors } = this.state;
    let newState;
    if (value === 'fix') {
      newState = {
        rateBy: value,
        usaget: '',
        usagev: '',
        validationErrors: validationErrors.set('aprice', 'required').set('usagev', '').set('usaget', ''),
      };
    } else {
      newState = {
        rateBy: value,
        aprice: '',
        validationErrors: validationErrors.set('aprice', '').set('usagev', 'required').set('usaget', 'required'),
      };
    }
    this.setState(newState);
  }

  onCreditCharge = () => {
    const { aid, sid } = this.props;
    const { rateBy, aprice, usagev, usaget, rate, validationErrors } = this.state;
    if (validationErrors.valueSeq().includes('required')) {
      return;
    }
    let params = [
      { aid },
      { sid },
      { rate },
      { credit_time: moment().toISOString() },
    ];
    if (rateBy === 'fix') {
      params = [...params, { aprice }];
    } else {
      params = [...params, { usagev }, { usaget }];
    }
    this.setState({ progress: true });
    this.props.dispatch(creditCharge(params)).then(this.afterCharge);
  };

  afterCharge = (response) => {
    this.setState({ progress: false });
    if (response.status) {
      this.props.onClose();
    }
  }

  getAvailableUsageTypes = () => {
    const { usageTypes } = this.props;
    return usageTypes.map(usaget => ({ value: usaget, label: usaget })).toArray();
  }

  getAvailableRates = () => {
    const { allRates } = this.props;
    return allRates.map(rate => ({ value: rate.get('key'), label: rate.get('key') })).toArray();
  }

  render() {
    const { rateBy, aprice, usagev, usaget, rate, validationErrors, progress } = this.state;
    const availableRates = this.getAvailableRates();
    const availableUsageTypes = this.getAvailableUsageTypes();
    return (
      <ModalWrapper
        show={true}
        progress={progress}
        labelProgress="Charging..."
        labelOk="Charge"
        title="Credit Charge"
        onOk={this.onCreditCharge}
        onCancel={this.props.onClose}
      >
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>Rate By</Col>
            <Col sm={10}>
              <Col sm={3}>
                <Field
                  fieldType="radio"
                  name="rate-by"
                  id="rate-by-fix"
                  value="fix"
                  checked={rateBy === 'fix'}
                  onChange={this.onChangeCreditBy}
                  label="Fixed price"
                />
              </Col>
              <Col sm={3}>
                <Field
                  fieldType="radio"
                  name="rate-by"
                  id="rate-by-usagev"
                  value="usagev"
                  checked={rateBy === 'usagev'}
                  onChange={this.onChangeCreditBy}
                  label="Volume"
                />
              </Col>
            </Col>
          </FormGroup>

          <FormGroup validationState={validationErrors.get('aprice', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Price</Col>
            <Col sm={10}>
              <Field
                onChange={this.onChangeCreditValue.bind(this, 'aprice')}
                value={aprice}
                fieldType="price"
                disabled={rateBy !== 'fix'}
              />
              { validationErrors.get('aprice', '').length > 0 ? <HelpBlock>{validationErrors.get('aprice', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          <FormGroup validationState={validationErrors.get('usagev', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Volume</Col>
            <Col sm={10}>
              <Field
                onChange={this.onChangeCreditValue.bind(this, 'usagev')}
                value={usagev}
                fieldType="number"
                disabled={rateBy !== 'usagev'}
              />
              { validationErrors.get('usagev', '').length > 0 ? <HelpBlock>{validationErrors.get('usagev', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          <FormGroup validationState={validationErrors.get('usaget', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Unit Type</Col>
            <Col sm={10}>
              <Select
                id="usaget"
                onChange={this.onChangeSelectValue.bind(this, 'usaget')}
                value={usaget}
                disabled={rateBy !== 'usagev'}
                options={availableUsageTypes}
              />
              { validationErrors.get('usaget', '').length > 0 ? <HelpBlock>{validationErrors.get('usaget', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>

          <FormGroup validationState={validationErrors.get('rate', '').length > 0 ? 'error' : null}>
            <Col sm={2} componentClass={ControlLabel}>Rate</Col>
            <Col sm={10}>
              <Select
                id="rate"
                onChange={this.onChangeSelectValue.bind(this, 'rate')}
                value={rate}
                options={availableRates}
              />
              { validationErrors.get('rate', '').length > 0 ? <HelpBlock>{validationErrors.get('rate', '')}</HelpBlock> : ''}
            </Col>
          </FormGroup>
        </Form>
      </ModalWrapper>
    );
  }
}

const mapStateToProps = state => ({
  usageTypes: state.settings.get('usage_types'),
  allRates: state.list.get('all_rates'),
});

export default connect(mapStateToProps)(Credit);
