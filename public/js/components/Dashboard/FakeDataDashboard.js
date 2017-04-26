import React, { Component, PropTypes } from 'react';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import DoughnutSelectable from './Widgets/DoughnutSelectable';
import PercentBar from './Widgets/PercentBar';
import LineCompare from './Widgets/LineCompare';
import BarCompare from './Widgets/BarCompare';
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

        <Col sm={12}>
          <Col sm={4}>
            <Panel header="Fake data selectable doughnut with details chart">
              <DoughnutSelectable data={doughnutDetailsData} type="details" parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </Panel>
          </Col>
          <Col sm={8}>
            <Panel header="Fake data bar chart">
              <BarCompare data={barData} parseYValue={this.parseCurrencyThousandValue} placeHolderProps={placeHolder} />
            </Panel>
          </Col>
        </Col>

        <Col sm={12}>
          <Col sm={4}>
            <Panel header="Fake data selectable doughnut with legend chart" className="mt0">
              <DoughnutSelectable data={doughnutLegendData} parseValue={parseCountValue} parsePercent={parsePercent} />
            </Panel>
          </Col>
          <Col sm={8}>
            <Panel header="Fake data lines chart">
              <LineCompare data={linesData} parseYValue={this.parseCurrencyThousandValue} parseXValue={parseDateValue} />
            </Panel>
          </Col>
        </Col>

        <Col sm={12}>
          <Col sm={6}>
            <Panel header="Fake data percent chart">
              <PercentBar data={percentBarData} parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </Panel>
          </Col>
          <Col sm={6}>
            <Panel header="Fake data percent chart">
              <PercentBar data={percentBarData} parseValue={this.parseCurrencyValue} parsePercent={parsePercent} />
            </Panel>
          </Col>
        </Col>

      </Row>
    );
  }
}

export default DashboardBase(FakeDataDashboard);
