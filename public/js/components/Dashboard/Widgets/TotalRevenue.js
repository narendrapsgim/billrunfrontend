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
    data: PropTypes.instanceOf(Immutable.List),
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

  parseData = () => {
    const { data } = this.props;
    if (data === null) {
      return null;
    }
    return {
      values: data.map(val => val.get('due', 0)).toArray(),
    };
  }

  render() {
    return (
      <PercentBar
        data={this.parseData()}
        parseValue={this.parseCurrencyValue}
        parsePercent={parsePercent}
      />
    );
  }
}

const mapStateToProps = (state, props) => ({ // eslint-disable-line no-unused-vars
  data: state.dashboard.get('total_revenue'),
});

export default connect(mapStateToProps)(TotalRevenue);
