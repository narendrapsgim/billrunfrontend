import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { DoughnutSelectable } from '../../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parsePercent,
} from '../helper';
import { getRevenueByPlan } from '../../../actions/dashboardActions';

class RevenueByPlan extends Component {

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      null,
    ]),
    currency: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: null,
  }

  componentDidMount() {
    this.props.dispatch(getRevenueByPlan('revenue_by_plan'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  render() {
    const { data } = this.props;
    return (
      <DoughnutSelectable
        data={data}
        type="details"
        parseValue={this.parseCurrencyValue}
        parsePercent={parsePercent}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('revenue_by_plan'),
});

export default connect(mapStateToProps)(RevenueByPlan);
