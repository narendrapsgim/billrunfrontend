import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Select from 'react-select';
import {
  plansOptionsSelector,
} from '../../selectors/listSelectors';
import { formatSelectOptions } from '../../common/Util';
import { getList } from '../../actions/listActions';
import { getPlansKeysQuery } from '../../common/ApiQueries';


class PlanSearch extends Component {

  static propTypes = {
    options: PropTypes.instanceOf(Immutable.List),
    selectedOptions: PropTypes.array,
    onSelectPlan: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    options: Immutable.List(),
    selectedOptions: [],
    onSelectPlan: () => {},
  };

  state = { val: null }

  componentDidMount() {
    this.props.dispatch(getList('available_plans', getPlansKeysQuery()));
  }

  onSelectPlan = (planKey) => {
    if (planKey) {
      this.props.onSelectPlan(planKey);
    }
    this.setState({ val: null });
  }

  render() {
    const { options, selectedOptions } = this.props;

    const formatedOptions = options
      .filter(option => !selectedOptions.includes(option.get('value', '')))
      .map(formatSelectOptions)
      .toArray();

    return (
      <div className="PlanSearch">
        <Select
          value={this.state.val}
          onChange={this.onSelectPlan}
          options={formatedOptions}
          placeholder="Search by plan name..."
          noResultsText="No plans found, please try another name"
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  options: plansOptionsSelector(state, props),
});
export default connect(mapStateToProps)(PlanSearch);
