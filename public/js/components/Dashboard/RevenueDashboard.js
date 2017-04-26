import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Panel, Col } from 'react-bootstrap';
import { List } from 'immutable';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import {
  PercentBar,
  LineCompare,
  DoughnutSelectable,
} from '../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parsePercent,
  parseDateValue,
  parseMonthValue,
  getParsedData,
} from './helper';
import {
  getTotalRevenue,
  getRevenueOverTime,
  getRevenueByPlan,
  getAgingDebt,
  getOutstandingDebt,
  getDebtOverTime,
} from '../../actions/dashboardActions';

class RevenueDashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currency: PropTypes.string,
    totalRevenue: PropTypes.array,
    revenueOverTime: PropTypes.array,
    revenueByPlan: PropTypes.array,
    agingDebt: PropTypes.array,
    outstandingDebt: PropTypes.array,
    debtOverTime: PropTypes.array,
  };

  static defaultProps = {
    totalRevenue: [],
    revenueOverTime: [],
    revenueByPlan: [],
    agingDebt: [],
    outstandingDebt: [],
    debtOverTime: [],
  }

  componentDidMount() {
    this.props.dispatch(getTotalRevenue('total_revenue'));
    this.props.dispatch(getRevenueOverTime('revenue_over_time'));
    this.props.dispatch(getRevenueByPlan('revenue_by_plan'));
    this.props.dispatch(getAgingDebt('aging_debt'));
    this.props.dispatch(getOutstandingDebt('outstanding_debt'));
    this.props.dispatch(getDebtOverTime('debt_over_time'));
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  getParsedData = (data) => {
    if (!data || !data[0] || !data[0].data) {
      return List();
    }

    return List(data[0].data);
  }

  getLineChartWithAvgData = (data, valueKey) => {
    const currYear = moment().format('YYYY');
    const lastYear = moment().subtract(1, 'years').format('YYYY');
    const values = {
      [currYear]: [],
      [lastYear]: [],
    };
    getParsedData(data).forEach((val) => {
      const year = val.billrun_key.substring(0, 4);
      values[year].push(val[valueKey]);
    });
    const lastYearCount = values[lastYear].length;
    const lastYearAvg = values[lastYear].reduce((p, c) => p + c, 0) / lastYearCount;

    return {
      x: [
        {
          label: currYear,
          values: values[currYear],
        },
        {
          label: lastYear,
          values: values[lastYear],
        },
        {
          label: `${lastYear} AVG`,
          values: Array.from(Array(lastYearCount)).map(() => lastYearAvg),
        },
      ],
      y: Array.from(Array(lastYearCount)).map((v, i) => moment().month(i).date(1)),
    };
  }

  getParsedTotalRevenueData = () => {
    const { totalRevenue } = this.props;
    return {
      values: getParsedData(totalRevenue).map(val => val.due).toArray(),
    };
  }

  getParsedRevenueOverTimeData = () => {
    const { revenueOverTime } = this.props;
    return this.getLineChartWithAvgData(revenueOverTime, 'due');
  }

  getParsedRevenueByPlanData = () => {
    const { revenueByPlan } = this.props;
    const ret = {
      labels: [],
      values: [],
      sign: [],
    };

    getParsedData(revenueByPlan).forEach((val) => {
      ret.labels.push(val.plan);
      ret.values.push(val.amount);
      ret.sign.push(val.amount - val.prev_amount);
    });
    return ret;
  }

  getAgingDebtData = () => {
    const { agingDebt } = this.props;
    const values = [];
    const keys = [];
    getParsedData(agingDebt).forEach((val) => {
      const year = val.billrun_key.substring(0, 4);
      const month = val.billrun_key.substring(4, 6);
      values.push(val.left_to_pay);
      keys.push(moment().year(year).month(month - 1).date(1));
    });
    return {
      x: [
        {
          label: 'Aging Debt',
          values,
        },
      ],
      y: keys,
    };
  }

  getParsedOutstandingDebtData = () => {
    const { outstandingDebt } = this.props;
    return {
      values: getParsedData(outstandingDebt).map(val => val.due).toArray(),
    };
  }

  getParsedDebtOverTimeData = () => {
    const { debtOverTime } = this.props;
    return this.getLineChartWithAvgData(debtOverTime, 'due');
  }

  render() {
    return (
      <Row>
        <Col sm={5} lg={3}>
          <Panel header="Total Revenue">
            <div className="dashboard-chart-wrapper">
              <PercentBar
                data={this.getParsedTotalRevenueData()}
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </div>
          </Panel>
        </Col>
        <Col sm={7} lg={9}>
          <Panel header="Revenue over time">
            <div className="dashboard-chart-wrapper">
              <LineCompare
                data={this.getParsedRevenueOverTimeData()}
                parseYValue={this.parseCurrencyThousandValue}
                parseXValue={parseMonthValue}
              />
            </div>
          </Panel>
        </Col>
        <Col sm={5} lg={3}>
          <Panel header="Revenue by Plan">
            <div className="dashboard-chart-wrapper">
              <DoughnutSelectable
                data={this.getParsedRevenueByPlanData()}
                type="details"
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </div>
          </Panel>
        </Col>
        <Col sm={7} lg={9}>
          <Panel header="Aging Debt">
            <div className="dashboard-chart-wrapper">
              <LineCompare
                data={this.getAgingDebtData()}
                parseYValue={this.parseCurrencyThousandValue}
                parseXValue={parseDateValue}
              />
            </div>
          </Panel>
        </Col>
        <Col sm={5} lg={3}>
          <Panel header="Outstanding Debt">
            <div className="dashboard-chart-wrapper">
              <PercentBar
                data={this.getParsedOutstandingDebtData()}
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </div>
          </Panel>
        </Col>
        <Col sm={7} lg={9}>
          <Panel header="Debt over time">
            <div className="dashboard-chart-wrapper">
              <LineCompare
                data={this.getParsedDebtOverTimeData()}
                parseYValue={this.parseCurrencyThousandValue}
                parseXValue={parseMonthValue}
              />
            </div>
          </Panel>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({ // eslint-disable-line no-unused-vars
  totalRevenue: state.dashboard.get('total_revenue'),
  revenueOverTime: state.dashboard.get('revenue_over_time'),
  revenueByPlan: state.dashboard.get('revenue_by_plan'),
  agingDebt: state.dashboard.get('aging_debt'),
  outstandingDebt: state.dashboard.get('outstanding_debt'),
  debtOverTime: state.dashboard.get('debt_over_time'),
});

export default DashboardBase(connect(mapStateToProps)(RevenueDashboard));
