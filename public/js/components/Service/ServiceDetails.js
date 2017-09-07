import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { titleCase } from 'change-case';
import { Form, FormGroup, ControlLabel, HelpBlock, Col, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { ServiceDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';
import EntityFields from '../Entity/EntityFields';


export default class ServiceDetails extends Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map).isRequired,
    mode: PropTypes.string.isRequired,
    updateItem: PropTypes.func.isRequired,
    errorMessages: PropTypes.object,
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

  shouldComponentUpdate(nextProps, nextState) { // eslint-disable-line no-unused-vars
    return !Immutable.is(this.props.item, nextProps.item) || this.props.mode !== nextProps.mode;
  }

  onChangeName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.updateItem(['name'], value);
  }

  onChangePrice = (e) => {
    const { value } = e.target;
    this.props.updateItem(['price', 0, 'price'], value);
  }

  onChangeCycle = (value) => {
    this.props.updateItem(['price', 0, 'to'], value);
  }

  onChangeProrated = (e) => {
    const { value } = e.target;
    this.props.updateItem(['prorated'], value);
  }

  onChangeQuantitative = (e) => {
    const { value } = e.target;
    this.props.updateItem(['quantitative'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.updateItem(['description'], value);
  }

  onChangeAdditionalField = (field, value) => {
    this.props.updateItem(field, value);
  }

  onChangeServicePeriodType = (e) => {
    const { value } = e.target;
    this.props.updateItem(['balance_period', 'type'], value);
  }

  onSelectPeriodUnit = (unit) => {
    this.props.updateItem(['balance_period', 'unit'], unit);
  }

  onChangeBalancePeriod = (e) => {
    const { value } = e.target;
    this.props.updateItem(['balance_period', 'value'], value);
  }

  render() {
    const { errors } = this.state;
    const { item, mode } = this.props;
    const serviceCycleUnlimitedValue = globalSetting.serviceCycleUnlimitedValue;
    const editable = (mode !== 'view');
    const balancePeriodUnit = item.getIn(['balance_period', 'unit'], '');
    const balancePeriodUnitTitle = (balancePeriodUnit === '') ? 'Select unit...' : titleCase(balancePeriodUnit);
    const isByCycles = item.getIn(['balance_period', 'type'], 'default') === 'default';
    return (
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>
            Title<Help contents={ServiceDescription.description} />
          </Col>
          <Col sm={8} lg={9}>
            <Field value={item.get('description', '')} onChange={this.onChangeDescription} editable={editable} />
          </Col>
        </FormGroup>

        {['clone', 'create'].includes(mode) &&
          <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              Key <Help contents={ServiceDescription.name} />
            </Col>
            <Col sm={8} lg={9}>
              <Field value={item.get('name', '')} onChange={this.onChangeName} editable={editable} />
              { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
            </Col>
          </FormGroup>
        }

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Price</Col>
          <Col sm={4}>
            <Field value={item.getIn(['price', 0, 'price'], '')} onChange={this.onChangePrice} fieldType="price" editable={editable} />
          </Col>
        </FormGroup>

        {['clone', 'create'].includes(mode) &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>
              Align to <span className="danger-red"> *</span>
            </Col>
            <Col sm={8} lg={9}>
              <span style={{ display: 'inline-block', marginRight: 20 }}>
                <Field
                  fieldType="radio"
                  onChange={this.onChangeServicePeriodType}
                  name="service_period_type"
                  value="default"
                  label="Cycle"
                  checked={isByCycles}
                />
              </span>
              <span style={{ display: 'inline-block' }}>
                <Field
                  fieldType="radio"
                  onChange={this.onChangeServicePeriodType}
                  name="service_period_type"
                  value="custom_period"
                  label="Custom Period"
                  checked={!isByCycles}
                />
              </span>
            </Col>
          </FormGroup>
        }

        {(!isByCycles) &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2} >
              {!['clone', 'create'].includes(mode) && 'Custom Period'}
            </Col>
            <Col sm={4}>
              <InputGroup>
                <Field
                  disabled={isByCycles}
                  fieldType="number"
                  min="1"
                  step="1"
                  value={item.getIn(['balance_period', 'value'], '')}
                  onChange={this.onChangeBalancePeriod}
                  editable={editable}
                />
                <DropdownButton
                  id="balance-period-unit"
                  componentClass={InputGroup.Button}
                  title={balancePeriodUnitTitle}
                  disabled={isByCycles}
                >
                  <MenuItem eventKey="days" onSelect={this.onSelectPeriodUnit}>Days</MenuItem>
                  <MenuItem eventKey="weeks" onSelect={this.onSelectPeriodUnit}>Weeks</MenuItem>
                  <MenuItem eventKey="months" onSelect={this.onSelectPeriodUnit}>Months</MenuItem>
                  <MenuItem eventKey="years" onSelect={this.onSelectPeriodUnit}>Years</MenuItem>
                </DropdownButton>
              </InputGroup>
            </Col>
          </FormGroup>
        }

        {(isByCycles) &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2} >{!['clone', 'create'].includes(mode) && 'Cycles'}</Col>
            <Col sm={4}>
              <Field
                disabled={!isByCycles}
                value={item.getIn(['price', 0, 'to'], '')}
                onChange={this.onChangeCycle}
                fieldType="unlimited"
                unlimitedValue={serviceCycleUnlimitedValue}
                unlimitedLabel="Infinite"
                editable={editable}
              />
            </Col>
          </FormGroup>
        }

        {(['clone', 'create'].includes(mode) || (!['clone', 'create'].includes(mode) && isByCycles)) &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>Prorated?</Col>
            <Col sm={4} style={editable ? { padding: '10px 15px' } : { paddingTop: 5 }}>
              <Field
                fieldType="checkbox"
                value={!isByCycles ? false : item.get('prorated', '')}
                onChange={this.onChangeProrated}
                editable={editable}
                disabled={!isByCycles}
              />
            </Col>
          </FormGroup>
        }

        {(['clone', 'create'].includes(mode) || (!['clone', 'create'].includes(mode) && isByCycles)) &&
          <FormGroup>
            <Col componentClass={ControlLabel} sm={3} lg={2}>Quantitative?</Col>
            <Col sm={4} style={['clone', 'create'].includes(mode) ? { padding: '10px 15px' } : { paddingTop: 5 }}>
              <Field
                fieldType="checkbox"
                value={!isByCycles ? false : item.get('quantitative', '')}
                onChange={this.onChangeQuantitative}
                editable={['clone', 'create'].includes(mode)}
                disabled={!isByCycles}
              />
            </Col>
          </FormGroup>
        }
        <EntityFields
          entityName="services"
          entity={item}
          onChangeField={this.onChangeAdditionalField}
          editable={editable}
        />

      </Form>
    );
  }
}
