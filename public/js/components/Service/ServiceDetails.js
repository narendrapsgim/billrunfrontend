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

  onChangeName = (e) => {
    const { value } = e.target;
    this.props.updateItem(['name'], value);
  }

  onChangePrice = (e) => {
    const { value } = e.target;
    this.props.updateItem(['price'], value);
  }

  onChangeDescription = (e) => {
    const { value } = e.target;
    this.props.updateItem(['description'], value);
  }

  render() {
    let { item, mode } = this.props;

    return (
      <Form horizontal>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={3}>Name</Col>
          <Col sm={9}>
            <Field value={item.get('name', '')} onChange={this.onChangeName} disabled={mode === 'update'}/>
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={3}>Description</Col>
          <Col sm={9}>
            <Field value={item.get('description', '')} onChange={this.onChangeDescription}  fieldType="textarea" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={3}>Price</Col>
          <Col sm={9}>
            <Field value={item.get('price', '')} onChange={this.onChangePrice} fieldType='price' />
          </Col>
        </FormGroup>

      </Form>
    );
  }
}
