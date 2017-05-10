import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import pluralize from 'pluralize';
import { titleCase } from 'change-case';
import { DoughnutSelectable } from '../../Charts';
import {
  parsePercent,
  parseIntegerValue,
} from '../helper';
import { getPlanByCustomers } from '../../../actions/dashboardActions';

class PlanByCustomers extends Component {

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
    this.props.dispatch(getPlanByCustomers('plan_by_customers'));
  }

  shouldComponentUpdate(nextProps) {
    return !Immutable.is(this.props.data, nextProps.data);
  }

  parseLabel = value => titleCase(value);
  parseValue = value => `${parseIntegerValue(value)} ${pluralize('Subscriber', value)}`;

  render() {
    const { data } = this.props;
    return (
      <DoughnutSelectable
        data={data}
        type="details"
        parsePercent={parsePercent}
        parseLabel={this.parseLabel}
        parseValue={this.parseValue}
      />
    );
  }
}

const mapStateToProps = state => ({
  data: state.dashboard.get('plan_by_customers'),
});

export default connect(mapStateToProps)(PlanByCustomers);
