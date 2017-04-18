import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Panel, Col } from 'react-bootstrap';
import moment from 'moment';
import { Map } from 'immutable';
import changeCase from 'change-case';
import DashboardBase from './DashboardBase';
import DoughnutSelectable from './Widgets/DoughnutSelectable';
import PercentBar from './Widgets/PercentBar';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parseCountValue,
  parsePercent,
} from './helper';
import {
  fakePercentBar,
} from './fakeData';
import {
  getTotalRevenue,
  getOutstandingDebt,
  getCustomerStateDistribution,
} from '../../actions/dashboardActions';

class OverviewDashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fromDate: PropTypes.instanceOf(moment),
    toDate: PropTypes.instanceOf(moment),
    currency: PropTypes.string,
    totalRevenue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    outstandingDebt: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    customerStateDistribution: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    totalRevenue: {},
    outstandingDebt: {},
    customerStateDistribution: {},
  }

  state = {
    percentBarData: null,
  }

  componentDidMount() {
    const { fromDate, toDate } = this.props;
    this.props.dispatch(getTotalRevenue('total_revenue'));
    this.props.dispatch(getOutstandingDebt('outstanding_debt'));
    this.props.dispatch(getCustomerStateDistribution('customer_state_distribution'));

    fakePercentBar(fromDate, toDate).then(
      (percentBarData) => {
        this.isUnmount !== true && this.setState({ percentBarData });
      }
    );
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  getParsedData = (data) => {
    if (!data || !data[0] || !data[0].data || !data[0].data[0]) {
      return Map();
    }

    return Map(data[0].data[0]).sort();
  }

  getParsedTotalRevenueData = () => {
    const { totalRevenue } = this.props;
    return {
      values: this.getParsedData(totalRevenue).map(val => val).toArray(),
    };
  }

  getParsedOutstandingDebtData = () => {
    const { outstandingDebt } = this.props;
    console.log('Before:');
    console.log(this.getParsedData(outstandingDebt));
    console.log('After:');
    this.getParsedData(outstandingDebt).forEach(val => {
      console.log(val);
    });
    return {
      values: this.getParsedData(outstandingDebt).map(val => val).toArray(),
    };
  }

  getParsedCustomerStateDistributionData = () => {
    const { customerStateDistribution } = this.props;
    const ret = {
      labels: [],
      values: [],
    };
    this.getParsedData(customerStateDistribution).forEach((val, key) => {
      ret.labels.push(changeCase.titleCase(key));
      ret.values.push(val);
    });
    return ret;
  }

  render() {
    const {
      percentBarData,
    } = this.state;

    console.log(this.getParsedOutstandingDebtData());

    return (
      <Row>
        <Col sm={12}>
          <Col sm={6}>
            <Panel header="Total Revenue">
              <PercentBar
                data={this.getParsedTotalRevenueData()}
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </Panel>
          </Col>
          <Col sm={6}>
            <Panel header="Outstanding Debt">
              <PercentBar
                data={this.getParsedOutstandingDebtData()}
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </Panel>
          </Col>
        </Col>
        <Col sm={12}>
          <Col sm={6}>
            <Panel header="Total number of Customers">
              <PercentBar
                data={percentBarData}
                parseValue={this.parseCurrencyValue}
                parsePercent={parsePercent}
              />
            </Panel>
          </Col>
          <Col sm={6}>
            <Panel header="Customer State Distribution" className="mt0">
              <DoughnutSelectable
                data={this.getParsedCustomerStateDistributionData()}
                parseValue={parseCountValue}
                parsePercent={parsePercent}
              />
            </Panel>
          </Col>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({ // eslint-disable-line no-unused-vars
  totalRevenue: state.dashboard.get('total_revenue'),
  outstandingDebt: state.dashboard.get('outstanding_debt'),
  customerStateDistribution: state.dashboard.get('customer_state_distribution'),
});

export default DashboardBase(connect(mapStateToProps)(OverviewDashboard));
