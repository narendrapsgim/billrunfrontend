import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { PercentBar } from '../../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parsePercent,
} from '../helper';
import { getTotalRevenue } from '../../../actions/dashboardActions';

class TotalRevenue extends Component {

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
    this.props.dispatch(getTotalRevenue('total_revenue'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  render() {
    const { data } = this.props;
    return (
      <PercentBar
        data={data}
        parseValue={this.parseCurrencyValue}
        parsePercent={parsePercent}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('total_revenue'),
});

export default connect(mapStateToProps)(TotalRevenue);
