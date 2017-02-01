import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, FormControl, Col, Row, Panel, HelpBlock } from 'react-bootstrap';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';
import CreateButton from '../Elements/CreateButton';
import PlanPrice from './components/PlanPrice';


export default class Plan extends Component {

  static propTypes = {
    plan: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    mode: React.PropTypes.string.isRequired,
    onChangeFieldValue: React.PropTypes.func.isRequired,
    onPlanCycleUpdate: React.PropTypes.func.isRequired,
    onPlanTariffAdd: React.PropTypes.func.isRequired,
    onPlanTariffRemove: React.PropTypes.func.isRequired,
    errorMessages: React.PropTypes.object,
  }

  static defaultProps = {
    errorMessages: {
      name: {
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscore(A-Z, 0-9, _)',
      },
    },
  };

  state = {
    errors: {
      name: '',
    },
  }

  componentWillMount() {
    const { plan } = this.props;
    const count = plan.get('price', Immutable.List()).size;
    if (count === 0) {
      this.props.onPlanTariffAdd(false);
    }
  }

  onPlanTrailTariffInit = (e) => {
    this.props.onPlanTariffAdd(true);
  }

  onPlanTariffInit = (e) => {
    this.props.onPlanTariffAdd(false);
  }

  onChangePlanName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.onChangeFieldValue(['name'], value);
  }

  onChangePlanCode = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['code'], value);
  }

  onChangePlanDescription = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['description'], value);
  }

  onChangePlanEach = (e) => {
    let value = parseInt(e.target.value);
    value = isNaN(value) ? '' : value;
    this.props.onChangeFieldValue(['recurrence', 'unit'], value);
  }

  onChangePeriodicity = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['recurrence', 'periodicity'], value);
  }

  onPlanPriceUpdate = (index, value) => {
    this.props.onChangeFieldValue(['price', index, 'price'], value);
  }

  onChangeUpfront = (e) => {
    let value = e.target.value;
    if (value === 'true' || value === 'TRUE') {
      value = true;
    } else if (value === 'false' || value === 'FALSE') {
      value = false;
    }
    this.props.onChangeFieldValue(['upfront'], value);
  }

  getPeriodicityOptions = () => {
    const periodicityOptions = { '': 'Select...', month: 'Monthly', year: 'Yearly' };
    return Object.keys(periodicityOptions).map((key, i) =>
      <option value={key} key={i}>{periodicityOptions[key]}</option>
    );
  }

  getAddPriceButton = (trial = false) => {
    const onclick = trial ? this.onPlanTrailTariffInit : this.onPlanTariffInit;
    return (<CreateButton onClick={onclick} label="Add New" />);
  }

  getTrialPrice = () => {
    const { plan } = this.props;
    const trial = (plan.getIn(['price', 0, 'trial']) === true) ? plan.getIn(['price', 0]) : null;
    if (trial) {
      return (
        <PlanPrice
          index={0}
          count={plan.get('price', Immutable.List()).size}
          item={trial}
          isTrialExist={true}
          onPlanPriceUpdate={this.onPlanPriceUpdate}
          onPlanCycleUpdate={this.props.onPlanCycleUpdate}
          onPlanTariffAdd={this.props.onPlanTariffAdd}
          onPlanTariffRemove={this.props.onPlanTariffRemove}
        />);
    }
    return this.getAddPriceButton(true);
  }

  getPrices = () => {
    const { plan } = this.props;
    const isTrialExist = (plan.getIn(['price', 0, 'trial']) === true || plan.getIn(['price', 0, 'trial']) === 'true');
    const count = plan.get('price', Immutable.List()).size;
    const prices = [];

    plan.get('price', Immutable.List()).forEach((price, i) => {
      if (price.get('trial') !== true) {
        prices.push(
          <PlanPrice
            key={i}
            index={i}
            count={count}
            item={price}
            isTrialExist={isTrialExist}
            onPlanPriceUpdate={this.onPlanPriceUpdate}
            onPlanCycleUpdate={this.props.onPlanCycleUpdate}
            onPlanTariffRemove={this.props.onPlanTariffRemove}
          />
        );
      }
    });
    return prices;
  }

  render() {
    const { errors } = this.state;
    const { plan, mode } = this.props;
    const periodicity = plan.getIn(['recurrence', 'periodicity']) || '';
    const upfront = typeof plan.get('upfront') !== 'boolean' ? '' : plan.get('upfront');

    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <Panel>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Title<Help contents={PlanDescription.description} /></Col>
                <Col sm={8} lg={9}>
                  <Field value={plan.get('description', '')} onChange={this.onChangePlanDescription} />
                </Col>
              </FormGroup>

              {mode === 'new' &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>Key<Help contents={PlanDescription.name} /></Col>
                  <Col sm={8} lg={9}>
                    <Field id="PlanName" onChange={this.onChangePlanName} value={plan.get('name', '')} required={true} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>External Code<Help contents={PlanDescription.code} /></Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangePlanCode} value={plan.get('code', '')} />
                </Col>
              </FormGroup>

              {/*
              <Col lg={4} md={4}>
                    <FormGroup>
                    <ControlLabel>Recurrence</ControlLabel>
                    <Field min="1" fieldType="number" value={plan.getIn(['recurrence', 'unit'], '')} onChange={this.onChangePlanEach} />
                    </FormGroup>
              </Col>
              */}

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Billing Frequency</Col>
                <Col sm={4}>
                  <FormControl componentClass="select" placeholder="select" value={periodicity} onChange={this.onChangePeriodicity}>
                    { this.getPeriodicityOptions() }
                  </FormControl>
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Charging Mode</Col>
                <Col sm={4}>
                  <FormControl componentClass="select" placeholder="select" value={upfront} onChange={this.onChangeUpfront}>
                    <option value="">Select...</option>
                    <option value={true}>Upfront</option>
                    <option value={false}>Arrears</option>
                  </FormControl>
                </Col>
              </FormGroup>

            </Panel>

            <Panel header={<h3>Trial Period</h3>}>
              { this.getTrialPrice() }
            </Panel>

            <Panel header={<h3>Recurring Charges</h3>}>
              { this.getPrices() }
              <br />
              { this.getAddPriceButton(false) }
            </Panel>

          </Form>
        </Col>
      </Row>
    );
  }
}
