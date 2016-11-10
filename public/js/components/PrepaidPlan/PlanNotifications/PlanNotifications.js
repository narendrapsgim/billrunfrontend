import React from 'react';
import { List, Map } from 'immutable';
import { times } from '../../../common/Util';
import { connect } from 'react-redux';

import Select from 'react-select';
import { Row, Col, Form, Panel, FormGroup, ControlLabel } from 'react-bootstrap';
import Notifications from './Notifications';

// TODO: get from server or somewhere names of thresholds
const threshold_name = (i) => (i + 1).toString();
const threshold_id = (name) => name === "On Load" ? 'on_load' : name;

const PlanNotifications = (props) => {
  const { plan, onRemoveBalanceNotifications, pp_includes } = props;

  const pp_include_name = (pp_id) => {
    return props.pp_includes
		.find(pp => pp.get('external_id') === parseInt(pp_id, 10), Map())
		.get('name');
  };
  
  const onSelectBalance = (pp_include_id) => {
   props.onSelectBalance(pp_include_id.toString());
  };
  
  const onAddNotification = (id) => {
    props.onAddNotification(id);
  };

  const onRemoveNotification = (id, index) => {
    props.onRemoveNotification(id, index);
  };

  const onUpdateNotificationField = (id, index, field, value) => {
    props.onUpdateNotificationField(id, index, field, value);
  };

  const onRemoveBalance = (id) => {
    props.onRemoveBalanceNotifications(id);
  };
  
  const notifications_el = (pp_id, i) => {
    let data = plan.getIn(['notifications_threshold', pp_id], List());
    let name = pp_include_name(pp_id);
    return (
      data.size ?
      <Notifications notifications={ data }
		     onAdd={ onAddNotification }
		     onRemove={ onRemoveNotification }
		     onUpdateField={ onUpdateNotificationField }
		     onRemoveBalance={ onRemoveBalance }
		     name={ name }
		     pp_id={ pp_id }
		     key={i} /> :
      null
    );
  };
  
  const options = pp_includes.map(pp => (
    { value: pp.get('external_id'),
      label: pp.get('name') }
  )).toJS();

  return (
    <div className="PlanNotifications">
      <Row>
	<Col lg={12}>
	  <Form>
	    <Panel header={ <h4>Select balance</h4> }>
	      <Select placeholder="Select" options={ options } onChange={ onSelectBalance } />
	    </Panel>
	    <hr/>
	    {
	      plan.get('notifications_threshold', Map())
		  .keySeq()
		  .filter(i => i !== 'on_load')
		  .map(notifications_el)
	    }
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
