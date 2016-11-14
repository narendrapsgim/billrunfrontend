import React, { Component } from 'react';

import Field from '../Field';
import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';

const PrepaidPlanDetails = (props) => {
  const { plan, action, onChangeField } = props;

  return (
    <div className="PrepaidPlanDetails">
      <Row>
        <Col lg={12}>
	  <Form>
	    <Panel>
	      <Row>
	        <Col lg={6} md={6}>
		  <FormGroup>
		    <ControlLabel>Name</ControlLabel>
		    <Field id="name"
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
	    </Panel>
	  </Form>
        </Col>
      </Row>
    </div>
  );
};

export default PrepaidPlanDetails;
