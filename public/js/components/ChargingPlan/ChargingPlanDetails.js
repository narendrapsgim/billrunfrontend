import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Row, Form, Panel, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import Field from '../Field';

const ChargingPlanDetails = (props) => {
  const { plan, action, onChangeField } = props;

  const operation_options = [
    { value: 'new', label: 'New' },
    { value: 'inc', label: 'Increment' },
    { value: 'set', label: 'Set' }
  ];

  const charging_type_options = [
    { value: 'card', label: 'Card' },
    { value: 'digital', label: 'Digital' }
  ];

  const onSelectOperation = (value) => {
    const e = {target: {id: 'operation', value}};
    props.onChangeField(e);
  };

  const onSelectChargingType = (values) => {
    const e = {target: {id: 'charging_type', value: values.split(',')}};
    props.onChangeField(e);
  };
  
  return (
    <div className="ChargingPlanDetails">
      <Row>
        <Col lg={12}>
          <Form>
            <Panel>
              <Row>
                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <Field
                        id="name"
                        value={ plan.get('name', '') }
                        required={ true }
                        disabled={ action === "update" }
                        onChange={ onChangeField }
                    />
                  </FormGroup>
                </Col>
                <Col lg={6} md={6}>
		  <FormGroup>
		    <ControlLabel>Code</ControlLabel>
		    <Field id="code"
			   value={ plan.get('code', '') }
			   required={ false }
			   onChange={ onChangeField }
		    />
		  </FormGroup>
                </Col>
              </Row>
	      <Row>
	        <Col lg={12} md={12}>
		  <FormGroup>
		    <ControlLabel>Description</ControlLabel>
		    <Field id="description"
			   value={ plan.get('description', '') }
			   fieldType="textarea"
			   onChange={ onChangeField }
		    />
		  </FormGroup>
	        </Col>
	      </Row>
              <Row>
                <Col lg={6} md={6}>
                  <FormGroup>
                    <ControlLabel>Operation</ControlLabel>
	            <Select
                        id="operation"
                        options={ operation_options }
		        value={ plan.get('operation', 'inc') }
		        onChange={ onSelectOperation }
	            />
                  </FormGroup>
                </Col>
                <Col lg={6} md={6}>
                  <ControlLabel>Charging value</ControlLabel>
                  <Field id="charging_value"
			 value={ plan.get('charging_value', 0) }
			 fieldType="number"
			 onChange={ onChangeField }
		  />                  
                </Col>                
              </Row>
            </Panel>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default connect()(ChargingPlanDetails);
