import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { PercentBar } from '../../Charts';
import {
  parseCurrencyValue,
  parsePercent,
} from '../helper';
import { getOutstandingDebt } from '../../../actions/dashboardActions';

class OutstandingDebt extends Component {

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
    this.props.dispatch(getOutstandingDebt('outstanding_debt'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseCurrencyValue = value => parseCurrencyValue(value, this.props.currency);

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
  data: state.dashboard.get('outstanding_debt'),
});

export default connect(mapStateToProps)(OutstandingDebt);
