import React, { Component } from 'react';
import Immutable from 'immutable';
import { Form, FormGroup, ControlLabel, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import ActionButtons from '../Elements/ActionButtons';


export default class Subscription extends Component {

  state = {
      plan: '',
      services: [],
  }

  componentWillMount() {
    this.setState({
      plan: this.props.subscription.get('plan', ''),
      services: this.props.subscription.get('services', Immutable.List()).toArray()
    });
  }

  onChangePlan = (plan) => {
    this.setState({plan});
  };

  onChangeService = (services) => {
    const servicesList = (services.length) ? services.split(',') : [];
    this.setState({services: servicesList});
  }

  onSave = () => {
    this.props.onSave(this.props.subscription, this.state);
  };
  
  render() {
    const { plan, services } = this.state;
    const { subscription, onCancel, all_plans, all_services } = this.props;

    if (!subscription) return (null);

    const available_plans = all_plans.map((plan, key) => {
      return { value: plan.get('name'),
               label:  plan.get('name') }
    }).toJS();

    const available_services = all_services.map((service, key) => ({
      value: service.get('name'),
      label: service.get('name'),
    })).toJS();

    return (
      <Form horizontal>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>Plan</Col>
          <Col sm={9}>
            <Select options={available_plans} value={plan} onChange={this.onChangePlan} />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalEmail">
          <Col componentClass={ControlLabel} sm={2}>Services</Col>
          <Col sm={9}>
            <Select multi={true} value={services.join(',')} options={available_services} onChange={this.onChangeService} />
          </Col>
        </FormGroup>

        <hr />
        <div>
          <Button onClick={this.onSave} bsStyle="primary" style={{ minWidth: 90, marginRight: 10 }}>Save</Button>
          <Button onClick={onCancel} bsStyle="default" style={{ minWidth: 90 }}>Cancel</Button>
        </div>

      </Form>
    );
  }
}
