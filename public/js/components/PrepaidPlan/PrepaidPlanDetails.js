import React, { Component } from 'react';

import Field from '../Field';
import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';

const PrepaidPlanDetails = (props) => {
  const { plan, action } = props;

  return (
    <Row>
      <Col lg={12}>
	<Form>
	  <Panel>
	    <Row>
	      <Col lg={6} md={6}>
		<FormGroup>
		  <ControlLabel>Name</ControlLabel>
		  <Field id="PlanName"
			 value={plan.get('name', '')}
			 required={true}
			 disabled={action === "update"} />
		</FormGroup>
	      </Col>
	    </Row>
	  </Panel>
	</Form>
      </Col>
    </Row>
  );
};

export default PrepaidPlanDetails;
