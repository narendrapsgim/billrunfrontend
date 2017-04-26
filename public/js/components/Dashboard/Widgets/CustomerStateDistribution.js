import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { DoughnutSelectable } from '../../Charts';
import {
  parseCountValue,
  parsePercent,
} from '../helper';
import { getCustomerStateDistribution } from '../../../actions/dashboardActions';

class CustomerStateDistribution extends Component {

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
    this.props.dispatch(getCustomerStateDistribution('customer_state_distribution'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  render() {
    const { data } = this.props;
    return (
      <DoughnutSelectable
        data={data}
        parseValue={parseCountValue}
        parsePercent={parsePercent}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('customer_state_distribution'),
});

export default connect(mapStateToProps)(CustomerStateDistribution);
