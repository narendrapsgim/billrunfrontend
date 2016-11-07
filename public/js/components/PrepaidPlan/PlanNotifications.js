import React, { Component } from 'react';
import { List } from 'immutable';
import { range } from '../../common/Util';

import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Notifications from './Notifications';

const PlanNotifications = (props) => {
  const { plan } = props;

  return (
    <Row>
      <Col lg={12}>
	<Form>
	  <Panel>
	    {
	      range(10).map((v, i) => (
		<Notifications data={plan.getIn(['plan_notifications', i], List())} />
	      ))
	    }
	  </Panel>
	</Form>
      </Col>
    </Row>
  );
};

export default PlanNotifications;
