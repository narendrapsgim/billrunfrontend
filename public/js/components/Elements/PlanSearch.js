import React, { Component } from 'react';
import Select from 'react-select';
import { apiBillRun } from '../../common/Api';
import { searchPlansByKeyQuery } from '../../common/ApiQueries';


export default class PlanSearch extends Component {

  static propTypes = {
    onSelectPlan: React.PropTypes.func.isRequired,
  }

  state = { val: null }

  onSelectPlan = (planKey) => {
    if (planKey) {
      this.props.onSelectPlan(planKey);
    }
    this.setState({ val: null });
  }

  getPlans = (input) => {
    if (input && input.length) {
      const key = input.toLowerCase();
      const query = searchPlansByKeyQuery(key, { name: 1 });
      return apiBillRun(query)
        .then(success => ({ options: success.data[0].data.details }))
        .catch(() => ({ options: [] }));
    }
    return Promise.resolve({ options: [] });
  }

  render() {
    return (
      <div className="PlanSearch">
        <Select
          value={this.state.val}
          cacheAsyncResults={false}
          onChange={this.onSelectPlan}
          asyncOptions={this.getPlans}
          valueKey="name"
          labelKey="name"
          placeholder="Search by plan name..."
          noResultsText="No plans found, please try another name"
        />
      </div>
    );
  }
}
