import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, FormControl, Col, Row, Panel, Button } from 'react-bootstrap';
import { PlanDescription } from '../../FieldDescriptions';
import Help from '../Help';
import Field from '../Field';


export default class ServiceDetails extends Component {

  static propTypes = {
    item: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    mode: React.PropTypes.string.isRequired,
    updateItem: React.PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(this.props.item, nextProps.item) || this.props.mode !== nextProps.mode;
  }

  onChangeName = (e) => {
    const { value } = e.target;
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
    const { item, mode } = this.props;
    const serviceCycleUnlimitedValue = globalSetting.serviceCycleUnlimitedValue;

    return (
      <Form horizontal>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Name</Col>
          <Col sm={9}>
            <Field value={item.get('name', '')} onChange={this.onChangeName} disabled={mode === 'update'} />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Description</Col>
          <Col sm={9}>
            <Field value={item.get('description', '')} onChange={this.onChangeDescription} fieldType="textarea" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Price</Col>
          <Col lg={3} sm={4}>
            <Field value={item.getIn(['price', 0, 'price'], '')} onChange={this.onChangePrice} fieldType="price" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Cycles</Col>
          <Col lg={3} sm={4}>
            <Field value={item.getIn(['price', 0, 'to'], '')} onChange={this.onChangeCycle} fieldType="unlimited" unlimitedValue={serviceCycleUnlimitedValue} />
          </Col>
        </FormGroup>

      </Form>
    );
  }
}
