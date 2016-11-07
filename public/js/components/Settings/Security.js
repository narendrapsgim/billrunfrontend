import React, { Component } from 'react';
import { Panel, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap';

const Security = (props) => (
  <div>
    <Panel header="Security">
      <Form horizontal>
	<FormGroup>
	  <Col componentClass={ControlLabel} md={2}>
	    Secret Key
	  </Col>
	  <Col sm={6}>
	    <FormControl type="text"
			 disabled={true}
			 value={props.data.get('secret', '')} />
	  </Col>
	</FormGroup>
      </Form>
    </Panel>
  </div>
);

export default Security;
