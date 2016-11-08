import React from 'react';
import { List } from 'immutable';
import { times } from '../../../common/Util';
import { connect } from 'react-redux';

import Select from 'react-select';
import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Notifications from './Notifications';

// TODO: get from server or somewhere names of thresholds
const threshold_name = (i) => (i + 1).toString();
const threshold_id = (name) => name === "On Load" ? 'on_load' : name;

const PlanNotifications = (props) => {
  const { plan } = props;

  const onSelectBalance = (v) => {
   props.onSelectBalance(threshold_name(v));
  };
  
  const onAddNotification = (name) => {
    const id = threshold_id(name);
    props.onAddNotification(id);
  };

  const onRemoveNotification = (name, index) => {
    const id = threshold_id(name);
    props.onRemoveNotification(id, index);
  };

  const onUpdateNotificationField = (name, index, field, value) => {
    const id = threshold_id(name);
    props.onUpdateNotificationField(id, index, field, value);
  };
  
  const notifications_el = (k, i) => {
    let data = plan.getIn(['notifications_threshold', (i + 1).toString()], List());
    let name = threshold_name(i);
    return (
      data.size ?
      <Notifications notifications={ data }
		     onAdd={ onAddNotification }
		     onRemove={ onRemoveNotification }
		     onUpdateField={ onUpdateNotificationField }
		     name={ name }
		     key={i} /> :
      null
    );
  };
  
  const options = times(10, (u, key) => ({value: key, label: `Balance ${(key + 1)}`}));
  
  return (
    <div className="PlanNotifications">
      <Row>
	<Col lg={12}>
	  <Form>
	    <Panel header={ <h4>Threshold</h4> }>
	      <Select placeholder="Select" options={ options } onChange={ onSelectBalance } />
	    </Panel>
	    { times(10, notifications_el) }
	    {/*
	    <Notifications notifications={plan.getIn(['notifications_threshold', 'on_load'], List())}
			   onAdd={ onAddNotification }
			   onRemove={ onRemoveNotification }
			   onUpdateField={ onUpdateNotificationField }
			   name="On Load" />
	    */}
	  </Form>
	</Col>
      </Row>
    </div>
  );
};

export default connect()(PlanNotifications);
