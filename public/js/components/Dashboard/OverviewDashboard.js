import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Row, Panel, Col } from 'react-bootstrap';
import { List } from 'immutable';
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
  getTotalRevenue,
  getOutstandingDebt,
  getTotalNumOfCustomers,
  getCustomerStateDistribution,
} from '../../actions/dashboardActions';

class OverviewDashboard extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currency: PropTypes.string,
    totalRevenue: PropTypes.array,
    outstandingDebt: PropTypes.array,
    totalNumOfCustomers: PropTypes.array,
    customerStateDistribution: PropTypes.array,
  };

  static defaultProps = {
    totalRevenue: [],
    outstandingDebt: [],
    totalNumOfCustomers: [],
    customerStateDistribution: [],
  }

  componentDidMount() {
    this.props.dispatch(getTotalRevenue('total_revenue'));
    this.props.dispatch(getOutstandingDebt('outstanding_debt'));
    this.props.dispatch(getTotalNumOfCustomers('total_num_of_customers'));
    this.props.dispatch(getCustomerStateDistribution('customer_state_distribution'));
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  getParsedData = (data) => {
    if (!data || !data[0] || !data[0].data) {
      return List();
    }

    return List(data[0].data);
  }

  getParsedTotalRevenueData = () => {
    const { totalRevenue } = this.props;
    return {
      values: this.getParsedData(totalRevenue).map(val => val.due).toArray(),
    };
  }

  getParsedOutstandingDebtData = () => {
    const { outstandingDebt } = this.props;
    return {
      values: this.getParsedData(outstandingDebt).map(val => val.due).toArray(),
    };
  }

  getParsedTotalNumOfCustomersData = () => {
    const { totalNumOfCustomers } = this.props;
    return {
      values: this.getParsedData(totalNumOfCustomers).map(val => val.customers_num).toArray(),
    };
  }

  getParsedCustomerStateDistributionData = () => {
    const { customerStateDistribution } = this.props;
    const ret = {
      labels: [],
      values: [],
    };
    this.getParsedData(customerStateDistribution).forEach((val) => {
      ret.labels.push(changeCase.titleCase(val.state));
      ret.values.push(val.customers_num);
    });
    return ret;
  }

  render() {
    return (
      <Row>
        <Col sm={6} lg={3}>
          <Panel header="Total Revenue">
            <PercentBar
              data={this.getParsedTotalRevenueData()}
              parseValue={this.parseCurrencyValue}
              parsePercent={parsePercent}
            />
          </Panel>
        </Col>
        <Col sm={6} lg={3}>
          <Panel header="Outstanding Debt">
            <PercentBar
              data={this.getParsedOutstandingDebtData()}
              parseValue={this.parseCurrencyValue}
              parsePercent={parsePercent}
            />
          </Panel>
        </Col>
        <Col sm={6} lg={3}>
          <Panel header="Total number of Customers">
            <PercentBar
              data={this.getParsedTotalNumOfCustomersData()}
              parseValue={parseCountValue}
              parsePercent={parsePercent}
            />
          </Panel>
        </Col>
        <Col sm={6} lg={3}>
          <Panel header="Customer State Distribution" className="mt0">
            <DoughnutSelectable
              data={this.getParsedCustomerStateDistributionData()}
              parseValue={parseCountValue}
              parsePercent={parsePercent}
            />
          </Panel>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state, props) => ({ // eslint-disable-line no-unused-vars
  totalRevenue: state.dashboard.get('total_revenue'),
  outstandingDebt: state.dashboard.get('outstanding_debt'),
  totalNumOfCustomers: state.dashboard.get('total_num_of_customers'),
  customerStateDistribution: state.dashboard.get('customer_state_distribution'),
});

export default DashboardBase(connect(mapStateToProps)(OverviewDashboard));
