import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Panel, Col } from 'react-bootstrap';
import { List } from 'immutable';
import moment from 'moment';
import DashboardBase from './DashboardBase';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  getParsedData,
} from './helper';
import {
  getAgingDebt,
  getOutstandingDebt,
  getDebtOverTime,
} from '../../actions/dashboardActions';
import {
  TotalRevenue,
  RevenueOverTime,
  RevenueByPlan,
} from './Widgets';


class RevenueDashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currency: PropTypes.string,
    agingDebt: PropTypes.array,
    outstandingDebt: PropTypes.array,
    debtOverTime: PropTypes.array,
  };

  static defaultProps = {
    totalRevenue: [],
    agingDebt: [],
    outstandingDebt: [],
    debtOverTime: [],
  }

  componentDidMount() {
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
    const { currency } = this.props;
    return (
      <Row>
        <Col sm={5} lg={3}>
          <Panel header="Total Revenue">
            <div className="dashboard-chart-wrapper">
              <TotalRevenue currency={currency} />
            </div>
          </Panel>
        </Col>
        <Col sm={7} lg={9}>
          <Panel header="Revenue over time">
            <div className="dashboard-chart-wrapper">
              <RevenueOverTime currency={currency} />
            </div>
          </Panel>
        </Col>

        <Col sm={5} lg={3}>
          <Panel header="Revenue by Plan">
            <div className="dashboard-chart-wrapper">
              <RevenueByPlan currency={currency} />
            </div>
          </Panel>
        </Col>

      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({ // eslint-disable-line no-unused-vars
  // agingDebt: state.dashboard.get('aging_debt'),
  // outstandingDebt: state.dashboard.get('outstanding_debt'),
  // debtOverTime: state.dashboard.get('debt_over_time'),
});

export default DashboardBase(connect(mapStateToProps)(RevenueDashboard));



// <Col sm={7} lg={9}>
//   <Panel header="Aging Debt">
//     <div className="dashboard-chart-wrapper">
//       <LineCompare
//         data={this.getAgingDebtData()}
//         parseYValue={this.parseCurrencyThousandValue}
//         parseXValue={parseDateValue}
//       />
//     </div>
//   </Panel>
// </Col>
// <Col sm={5} lg={3}>
//   <Panel header="Outstanding Debt">
//     <div className="dashboard-chart-wrapper">
//       <PercentBar
//         data={this.getParsedOutstandingDebtData()}
//         parseValue={this.parseCurrencyValue}
//         parsePercent={parsePercent}
//       />
//     </div>
//   </Panel>
// </Col>
// <Col sm={7} lg={9}>
//   <Panel header="Debt over time">
//     <div className="dashboard-chart-wrapper">
//       <LineCompare
//         data={this.getParsedDebtOverTimeData()}
//         parseYValue={this.parseCurrencyThousandValue}
//         parseXValue={parseMonthValue}
//       />
//     </div>
//   </Panel>
// </Col>
