import React, { Component } from 'react';
import Immutable from 'immutable';
import { sentenceCase } from 'change-case';
import { Form, FormGroup, ControlLabel, FormControl, Col, Row, Panel, HelpBlock } from 'react-bootstrap';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';
import CreateButton from '../Elements/CreateButton';
import PlanPrice from './components/PlanPrice';
import EntityFields from '../Entity/EntityFields';
import {
  getFieldName,
  getFieldNameType,
} from '../../common/Util';

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
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscores (A-Z, 0-9, _)',
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
      this.props.onPlanTariffAdd();
    }
  }

  onPlanTrailTariffInit = (e) => {
    this.props.onPlanTariffAdd(true);
  }

  onPlanTariffInit = (e) => {
    this.props.onPlanTariffAdd();
  }

  onChangePlanName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.onChangeFieldValue(['name'], value);
  }

  onChangeProrated = (e) => {
    const { value } = e.target;
    this.props.onChangeFieldValue(['prorated'], value);
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

  onChangeAdditionalField = (field, value) => {
    this.props.onChangeFieldValue(field, value);
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
    const { plan, mode } = this.props;
    const editable = (mode !== 'view');
    const trial = (plan.getIn(['price', 0, 'trial']) === true) ? plan.getIn(['price', 0]) : null;
    if (trial) {
      return (
        <PlanPrice
          index={0}
          count={plan.get('price', Immutable.List()).size}
          item={trial}
          mode={mode}
          isTrialExist={true}
          onPlanPriceUpdate={this.onPlanPriceUpdate}
          onPlanCycleUpdate={this.props.onPlanCycleUpdate}
          onPlanTariffAdd={this.props.onPlanTariffAdd}
          onPlanTariffRemove={this.props.onPlanTariffRemove}
        />);
    }
    return editable ? this.getAddPriceButton(true) : null;
  }

  getPrices = () => {
    const { plan, mode } = this.props;
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
            mode={mode}
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
    const editable = (mode !== 'view');

    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <Panel>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  { getFieldName('description', getFieldNameType('service'), sentenceCase('title'))}
                  <Help contents={PlanDescription.description} />
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={plan.get('description', '')} onChange={this.onChangePlanDescription} editable={editable} />
                </Col>
              </FormGroup>

              {['clone', 'create'].includes(mode) &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    { getFieldName('name', getFieldNameType('service'), sentenceCase('key'))} <Help contents={PlanDescription.name} />
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field id="PlanName" onChange={this.onChangePlanName} value={plan.get('name', '')} required={true} editable={editable} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Billing Frequency</Col>
                <Col sm={4}>
                  { editable
                    ? (
                      <FormControl componentClass="select" placeholder="select" value={periodicity} onChange={this.onChangePeriodicity} >
                        { this.getPeriodicityOptions() }
                      </FormControl>
                    )
                  : <div className="non-editable-field">{ periodicity }</div>
                  }
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Charging Mode</Col>
                <Col sm={4}>
                  { editable
                    ? (
                      <FormControl componentClass="select" placeholder="select" value={upfront} onChange={this.onChangeUpfront}>
                        <option value="">Select...</option>
                        <option value={true}>Upfront</option>
                        <option value={false}>Arrears</option>
                      </FormControl>
                    )
                    : <div className="non-editable-field">{ upfront ? 'Upfront' : 'Arrears'}</div>
                  }

                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>Prorated?</Col>
                <Col sm={4} style={editable ? { padding: '10px 15px' } : { paddingTop: 5 }}>
                  <Field value={plan.get('prorated', '')} onChange={this.onChangeProrated} fieldType="checkbox" editable={editable} />
                </Col>
              </FormGroup>

              <EntityFields
                entityName="plans"
                entity={plan}
                onChangeField={this.onChangeAdditionalField}
                editable={editable}
              />

            </Panel>

            <Panel header={<h3>Trial Period</h3>}>
              { this.getTrialPrice() }
            </Panel>

            <Panel header={<h3>Recurring Charges</h3>}>
              { this.getPrices() }
              <br />
              { editable && this.getAddPriceButton(false) }
            </Panel>

          </Form>
        </Col>
      </Row>
    );
  }
}
