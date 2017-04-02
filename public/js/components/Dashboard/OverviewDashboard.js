import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import DoughnutSelectable from './Widgets/DoughnutSelectable'


const dataA = {
  labels: ['Existing', 'New', 'Dorm.', 'Churn'],
  values: [84000, 21000, 7000, 3000],
};

const datab = {
  labels: ['Plan A', 'Plan B', 'Plan C', 'Plan D'],
  values: [200, 184, 57, 99],
  sign: [1, 0, -1, 6],
};

const OverviewDashboard = ({ fromDate, toDate }) => (
  <Row>
    <Col sm={12}>
      <Col sm={6}>
        <Panel header="Customer Sate Distribution">
          <DoughnutSelectable data={dataA} />
        </Panel>
      </Col>
      <Col sm={6}>
        <Panel header="Revenue by Payment type">
          <DoughnutSelectable data={datab} type="details" />
        </Panel>
      </Col>
    </Col>
  </Row>
);

OverviewDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
};

export default DashboardBase(OverviewDashboard);
