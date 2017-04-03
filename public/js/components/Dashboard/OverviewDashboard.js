import React, { PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import DoughnutSelectable from './Widgets/DoughnutSelectable';
import PercentBar from './Widgets/PercentBar';

import {
  fakeDoughnutDetails,
  fakeDoughnutLegend,
  fakePercentBar,
} from './fakeData';

const OverviewDashboard = ({ fromDate, toDate, currency }) => {
  const parseCurrencyValue = value => Number(value).toLocaleString('en-US', { style: 'currency', currency });
  const parseCountValue = value => Number(value).toLocaleString('en-US');
  return (
    <Row>
      <Col sm={12}>
        <Col sm={6}>
          <Panel header={`Customer Sate Distribution ${currency}`}>
            <DoughnutSelectable data={fakeDoughnutLegend()} parseValue={parseCountValue} />
          </Panel>
        </Col>
        <Col sm={6}>
          <Panel header="Revenue by Payment type">
            <DoughnutSelectable data={fakeDoughnutDetails()} type="details" parseValue={parseCurrencyValue} />
          </Panel>
        </Col>
        <Col sm={6}>
          <Panel header="Revenue by Payment type">
            <PercentBar data={fakePercentBar()} parseValue={parseCurrencyValue} />
          </Panel>
        </Col>
      </Col>
    </Row>
  );
};

OverviewDashboard.propTypes = {
  fromDate: PropTypes.instanceOf(moment),
  toDate: PropTypes.instanceOf(moment),
  currency: PropTypes.string,
};

export default DashboardBase(OverviewDashboard);
