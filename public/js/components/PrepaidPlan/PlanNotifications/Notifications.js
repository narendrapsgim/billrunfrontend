import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Form, Panel, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import Notification from './Notification';

const Notifications = (props) => {
  const onAdd = () => {
    props.onAdd(props.name);
  };

  const onRemove = (index) => {
    props.onRemove(props.name, index);
  };

  const onUpdateField = (index, field, value) => {
    props.onUpdateField(props.name, index, field, value);
  };

  const notification_el = (notification, i) => {
    let first = i === 0;
    let last = i === props.notifications.size - 1;
    return (
      <Notification notification={ notification }
		    first={ first }
		    last={ last }
		    onRemove={ onRemove }
		    onUpdateField={ onUpdateField }
		    index={ i }
		    key={i} />
    );
  };
  
  return (
    <div className="Notifications">
      <Panel header={ <h4>{ props.name }</h4> }>
	{ props.notifications.map(notification_el) }
	<br/>
	<Button bsSize="small" className="btn-primary" onClick={onAdd}>
	  <i className="fa fa-plus"></i> Add New
	</Button>
      </Panel>
    </div>
  );
};

export default connect()(Notifications);
