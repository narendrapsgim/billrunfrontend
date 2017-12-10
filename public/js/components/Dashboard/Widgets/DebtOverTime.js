import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { LineCompare } from '../../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parseMonthValue,
} from '../helper';
import { getDebtOverTime } from '../../../actions/dashboardActions';

class DebtOverTime extends Component {

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
    this.props.dispatch(getDebtOverTime('debt_over_time'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);
  parseCurrencyThousandValue = value => parseCurrencyThousandValue(value, this.props.currency);

  render() {
    const { data } = this.props;
    return (
      <LineCompare
        data={data}
        parseYValue={this.parseCurrencyThousandValue}
        parseXValue={parseMonthValue}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('debt_over_time'),
});

export default connect(mapStateToProps)(DebtOverTime);
