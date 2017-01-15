import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, HelpBlock, Col } from 'react-bootstrap';
import { ServiceDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';


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
        allowedCharacters: 'Key contains illegal characters, key should contain only alphabets, numbers and underscore(A-Z, 0-9, _)',
      },
    },
  };

  state = {
    errors: {
      name: '',
    },
  }

  shouldComponentUpdate(nextProps, nextState) {
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

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.updateItem(['description'], value);
  }

  render() {
    const { errors } = this.state;
    const { item, mode } = this.props;
    const serviceCycleUnlimitedValue = globalSetting.serviceCycleUnlimitedValue;

    return (
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Title<Help contents={ServiceDescription.description} /></Col>
          <Col sm={8} lg={9}>
            <Field value={item.get('description', '')} onChange={this.onChangeDescription} />
          </Col>
        </FormGroup>

        {mode === 'new' &&
          <FormGroup validationState={errors.name.length > 0 ? 'error' : null} >
            <Col componentClass={ControlLabel} sm={3} lg={2}>Key <Help contents={ServiceDescription.name} /></Col>
            <Col sm={8} lg={9}>
              <Field value={item.get('name', '')} onChange={this.onChangeName} />
              { errors.name.length > 0 && <HelpBlock>{errors.name}</HelpBlock> }
            </Col>
          </FormGroup>
        }

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Price</Col>
          <Col sm={4}>
            <Field value={item.getIn(['price', 0, 'price'], '')} onChange={this.onChangePrice} fieldType="price" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={3} lg={2}>Cycles</Col>
          <Col sm={4}>
            <Field value={item.getIn(['price', 0, 'to'], '')} onChange={this.onChangeCycle} fieldType="unlimited" unlimitedValue={serviceCycleUnlimitedValue} unlimitedLabel="Infinite" />
          </Col>
        </FormGroup>

      </Form>
    );
  }
}
