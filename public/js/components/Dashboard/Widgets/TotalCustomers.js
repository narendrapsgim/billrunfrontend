import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import pluralize from 'pluralize';
import { PercentBar } from '../../Charts';
import {
  parseIntegerValue,
  parsePercent,
} from '../helper';
import { getTotalNumOfCustomers } from '../../../actions/dashboardActions';

class TotalCustomers extends Component {

  static propTypes = {
    data: PropTypes.oneOfType([
      PropTypes.instanceOf(Immutable.Map),
      null,
    ]),
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    data: null,
  }

  componentDidMount() {
    this.props.dispatch(getTotalNumOfCustomers('total_num_of_customers'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseValue = value => `${parseIntegerValue(value)} ${pluralize('Subscriber', value)}`;

  render() {
    const { data } = this.props;
    return (
      <PercentBar
        data={data}
        parseValue={this.parseValue}
        parsePercent={parsePercent}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('total_num_of_customers'),
});

export default connect(mapStateToProps)(TotalCustomers);
