import React, { Component, PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import {
  BarCompare,
  LineCompare,
  PercentBar,
  DoughnutSelectable,
} from '../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parseCountValue,
  parseDateValue,
  parsePercent,
} from './helper';
import {
  fakeDoughnutDetails,
  fakeDoughnutLegend,
  fakePercentBar,
  fakeLines,
  fakeBar,
} from './fakeData';


class FakeDataDashboard extends Component {

  static propTypes = {
    fromDate: PropTypes.instanceOf(moment),
    toDate: PropTypes.instanceOf(moment),
    currency: PropTypes.string,
  };

  state = {
    doughnutDetailsData: null,
    doughnutLegendData: null,
    percentBarData: null,
    linesData: null,
    barData: null,
  }

  componentDidMount() {
    const { fromDate, toDate } = this.props;
    fakeDoughnutDetails(fromDate, toDate).then(
      (doughnutDetailsData) => { this.isUnmount !== true && this.setState({ doughnutDetailsData }); }
    );
    fakeDoughnutLegend(fromDate, toDate).then(
      (doughnutLegendData) => { this.isUnmount !== true && this.setState({ doughnutLegendData }); }
    );
    fakePercentBar(fromDate, toDate).then(
      (percentBarData) => { this.isUnmount !== true && this.setState({ percentBarData }); }
    );
    fakeLines(fromDate, toDate).then(
      (linesData) => { this.isUnmount !== true && this.setState({ linesData }); }
    );
    fakeBar(fromDate, toDate).then(
      (barData) => { this.isUnmount !== true && this.setState({ barData }); }
    );
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  render() {
    const {
      doughnutDetailsData,
      doughnutLegendData,
      percentBarData,
      linesData,
      barData,
    } = this.state;

    const placeHolder = {
      message: 'Loading data, please wait....',
    };

    return (
      <Row>
        <Col sm={4}>
          <Panel header="Fake data selectable doughnut with details chart">
            <div className="dashboard-chart-wrapper">
              <DoughnutSelectable data={doughnutDetailsData} type="details" parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </div>
          </Panel>
        </Col>
        <Col sm={8}>
          <Panel header="Fake data bar chart">
            <div className="dashboard-chart-wrapper">
              <BarCompare data={barData} parseYValue={this.parseCurrencyThousandValue} placeHolderProps={placeHolder} />
            </div>
          </Panel>
        </Col>

        <Col sm={4}>
          <Panel header="Fake data selectable doughnut with legend chart" className="mt0">
            <div className="dashboard-chart-wrapper">
              <DoughnutSelectable data={doughnutLegendData} parseValue={parseCountValue} parsePercent={parsePercent} />
            </div>
          </Panel>
        </Col>
        <Col sm={8}>
          <Panel header="Fake data lines chart">
            <div className="dashboard-chart-wrapper">
              <LineCompare data={linesData} parseYValue={this.parseCurrencyThousandValue} parseXValue={parseDateValue} />
            </div>
          </Panel>
        </Col>

        <Col sm={4}>
          <Panel header="Fake data percent chart">
            <div className="dashboard-chart-wrapper">
              <PercentBar data={percentBarData} parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </div>
          </Panel>
        </Col>
        <Col sm={4}>
          <Panel header="Fake data percent chart">
            <div className="dashboard-chart-wrapper">
              <PercentBar data={percentBarData} parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </div>
          </Panel>
        </Col>
        <Col sm={4}>
          <Panel header="Fake data percent chart">
            <div className="dashboard-chart-wrapper">
              <PercentBar data={percentBarData} parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </div>
          </Panel>
        </Col>
      </Row>
    );
  }
}

export default DashboardBase(FakeDataDashboard);
