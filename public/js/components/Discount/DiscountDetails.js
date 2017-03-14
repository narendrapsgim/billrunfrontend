import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Row, Panel, HelpBlock } from 'react-bootstrap';
import Select from 'react-select';
import { titleCase, paramCase } from 'change-case';
import Help from '../Help';
import { DiscountDescription } from '../../FieldDescriptions';
import Field from '../Field';
import EntityFields from '../Entity/EntityFields';


export default class DiscountDetails extends Component {

  static propTypes = {
    discount: PropTypes.instanceOf(Immutable.Map),
    mode: PropTypes.string.isRequired,
    errorMessages: PropTypes.object,
    onFieldUpdate: PropTypes.func.isRequired,
    availablePlans: PropTypes.instanceOf(Immutable.List),
    availableServices: PropTypes.instanceOf(Immutable.List),
  }

  static defaultProps = {
    discount: Immutable.Map(),
    availablePlans: Immutable.List(),
    availableServices: Immutable.List(),
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
    newProductParam: false,
  }

  onChangeName = (e) => {
    const { errorMessages: { name: { allowedCharacters } } } = this.props;
    const { errors } = this.state;
    const value = e.target.value.toUpperCase();
    const newError = (!globalSetting.keyUppercaseRegex.test(value)) ? allowedCharacters : '';
    this.setState({ errors: Object.assign({}, errors, { name: newError }) });
    this.props.onFieldUpdate(['key'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['description'], value);
  }

  onChangeCycles = (value) => {
    this.props.onFieldUpdate(['cycles'], value);
  }

  onChangeLimit = (value) => {
    this.props.onFieldUpdate(['limit'], value);
  }

  onChangeAdditionalField = (field, value) => {
    this.props.onFieldUpdate(field, value);
  }

  onChangeDiscountType = (e) => {
    const { value } = e.target;
    this.props.onFieldUpdate(['discount_type'], value);
  }

  onChangePlan = (plan) => {
    this.props.onFieldUpdate(['params', 'plan'], plan);
  }

  onChangeDiscountValue = (value, a, b) => {
    console.log(value, a, b);
  }

  onChangeService = (services) => {
    const servicesList = (services.length) ? services.split(',') : [];
    this.props.onFieldUpdate(['params', 'service'], servicesList);
  }

  getAvailablePlans = () => {
    const { availablePlans } = this.props;
    return availablePlans.map(plan => ({
      value: plan.get('name'),
      label: plan.get('name'),
    }));
  }

  getAvailableServices = () => {
    const { availableServices } = this.props;
    return availableServices.map(service => ({
      value: service.get('name'),
      label: service.get('name'),
    }));
  }

  renderDiscountValues = () => {
    const { discount, mode } = this.props;
    const editable = (mode !== 'view');
    const discountSubject = discount.getIn(['params', 'service'], []);
    return discountSubject.map(key => (
      <FormGroup key={`${paramCase(key)}-discount-value`}>
        <Col componentClass={ControlLabel} sm={3} lg={2}>
          {key}
        </Col>
        <Col sm={8} lg={9}>
          <Field value="" onChange={this.onChangeDiscountValue} unlimitedLabel="Disabled" unlimitedValue="" fieldType="unlimited" editable={editable} />
        </Col>
      </FormGroup>
    ));
  }

  render() {
    const { errors } = this.state;
    const { discount, mode } = this.props;
    const editable = (mode !== 'view');
    const isPercentaget = discount.get('discount_type', '') === 'percentage';
    const availablePlans = this.getAvailablePlans().toJS();
    const availableServices = this.getAvailableServices().toJS();
    const services = discount.getIn(['params', 'service'], []).join(',');
    return (
      <Row>
        <Col lg={12}>
          <Form horizontal>
            <Panel>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Title<Help contents={DiscountDescription.description} />
                </Col>
                <Col sm={8} lg={9}>
                  <Field onChange={this.onChangeDescription} value={discount.get('description', '')} editable={editable} />
                </Col>
              </FormGroup>

              { ['clone', 'create'].includes(mode) &&
                <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
                  <Col componentClass={ControlLabel} sm={3} lg={2}>
                    Key<Help contents={DiscountDescription.key} />
                  </Col>
                  <Col sm={8} lg={9}>
                    <Field onChange={this.onChangeName} value={discount.get('key', '')} disabled={!['clone', 'create'].includes(mode)} editable={editable} />
                    { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
                  </Col>
                </FormGroup>
              }

              <FormGroup >
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Type
                </Col>
                <Col sm={8} lg={9}>
                  { editable
                    ? (
                      <span>
                        <span style={{ display: 'inline-block', marginRight: 20 }}>
                          <Field fieldType="radio" onChange={this.onChangeDiscountType} name="discount_type" value="percentage" label="Percentage" checked={isPercentaget} />
                        </span>
                        <span style={{ display: 'inline-block' }}>
                          <Field fieldType="radio" onChange={this.onChangeDiscountType} name="discount_type" value="monetary" label="Monetary" checked={!isPercentaget} />
                        </span>
                      </span>
                    )
                  : <div className="non-editble-field">{ titleCase(discount.get('discount_type', '')) }</div>
                  }
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Limit
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={discount.get('limit', '')} onChange={this.onChangeLimit} fieldType="unlimited" unlimitedValue="" editable={editable} />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Cycles
                </Col>
                <Col sm={8} lg={9}>
                  <Field value={discount.get('cycles', '')} onChange={this.onChangeCycles} fieldType="unlimited" unlimitedValue="" unlimitedLabel="Infinite" editable={editable} />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Plan
                </Col>
                <Col sm={8} lg={9}>
                  { editable
                    ? (
                      <Select options={availablePlans} value={discount.getIn(['params', 'plan'], '')} onChange={this.onChangePlan} />
                      )
                    : <div className="non-editble-field">{ discount.getIn(['params', 'plan'], '') }</div>
                  }
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3} lg={2}>
                  Services
                </Col>
                <Col sm={8} lg={9}>
                  { editable
                    ? (
                      <Select multi={true} value={services} options={availableServices} onChange={this.onChangeService} />
                      )
                    : <div className="non-editble-field">{ discount.getIn(['params', 'service'], []).join(', ') }</div>
                  }
                </Col>
              </FormGroup>

              <EntityFields
                entityName="discounts"
                entity={discount}
                onChangeField={this.onChangeAdditionalField}
                editable={editable}
              />

              <Panel header={<h3>Discount Values</h3>}>
                { this.renderDiscountValues() }
              </Panel>

            </Panel>
          </Form>
        </Col>
      </Row>
    );
  }

}
