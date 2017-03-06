import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import Select from 'react-select';
import { Row, Col, Form, Panel } from 'react-bootstrap';
import Notifications from './Notifications';


const PlanNotifications = (props) => {
  const { plan, ppIncludes, mode } = props;

  const editable = (mode !== 'view');

  const getPpIncludeName = (ppId) => {
    const PpInclude = ppIncludes.find(pp => pp.get('external_id', '') === parseInt(ppId), Map());
    return (PpInclude) ? PpInclude.get('name', '') : '';
  };

  const onSelectBalance = (ppIncludeId) => {
    props.onSelectBalance(ppIncludeId.toString());
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

  const notificationsEl = (ppId, i) => {
    const data = plan.getIn(['notifications_threshold', ppId], List());
    const name = getPpIncludeName(ppId);
    return (
      data.size ?
        <Notifications
          editable={editable}
          notifications={data}
          onAdd={onAddNotification}
          onRemove={onRemoveNotification}
          onUpdateField={onUpdateNotificationField}
          onRemoveBalance={onRemoveBalance}
          name={name}
          pp_id={ppId}
          key={i}
        /> :
      null
    );
  };

  const options = ppIncludes.map(pp => ({
    value: pp.get('external_id'),
    label: pp.get('name'),
  })).toJS();

  return (
    <div className="PlanNotifications">
      <Row>
        <Col lg={12}>
          <Form>
            { editable &&
              <Panel header={<h4>Select prepaid bucket</h4>}>
                <Select placeholder="Select" options={options} onChange={onSelectBalance} />
              </Panel>
            }
            { editable && <hr /> }
            {
              plan.get('notifications_threshold', Map())
                .keySeq()
                .filter(i => i !== 'on_load')
                .map(notificationsEl)
            }
            {/*
              <Notifications
                notifications={plan.getIn(['notifications_threshold', 'on_load'], List())}
                onAdd={onAddNotification}
                onRemove={onRemoveNotification}
                onUpdateField={onUpdateNotificationField}
                name="On Load"
              />
            */}
          </Form>
        </Col>
      </Row>
    </div>
  );
};

PlanNotifications.defaultProps = {
  plan: Map(),
  ppIncludes: List(),
  mode: 'create',
};

PlanNotifications.propTypes = {
  plan: PropTypes.instanceOf(Map),
  ppIncludes: PropTypes.instanceOf(List),
  onAddNotification: PropTypes.func.isRequired,
  onRemoveNotification: PropTypes.func.isRequired,
  onUpdateNotificationField: PropTypes.func.isRequired,
  onSelectBalance: PropTypes.func.isRequired,
  onRemoveBalanceNotifications: PropTypes.func.isRequired,
  mode: PropTypes.string,
};

export default connect()(PlanNotifications);
