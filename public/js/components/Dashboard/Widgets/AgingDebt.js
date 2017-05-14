import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { LineCompare } from '../../Charts';
import {
  parseCurrencyValue,
  parseCurrencyThousandValue,
  parseMonthValue,
} from '../helper';
import { getAgingDebt } from '../../../actions/dashboardActions';

class AgingDebt extends Component {

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
    this.props.dispatch(getAgingDebt('aging_debt'));
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
  data: state.dashboard.get('aging_debt'),
});

export default connect(mapStateToProps)(AgingDebt);
