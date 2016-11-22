import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import { apiBillRun } from '../../common/Api';

export default class PlanSearch extends Component {

  static propTypes = {
    onSelectPlan: React.PropTypes.func.isRequired,
  }

  state = { val: null }

  onSelectPlan = (planKey) => {
    if(planKey){
      this.props.onSelectPlan(planKey);
    }
    this.setState({val : null});
  }

  getPlans = (input, callback) => {
    if(input && input.length){
      const toadyApiString = moment();//  .format(globalSetting.apiDateTimeFormat);

      const query = {
        "name": {"$regex": input.toLowerCase(), "$options": "i"},
        /* "to": {"$gte" : toadyApiString},
         * "from": {"$lte" : toadyApiString},*/
      };
      const request = [{
        api: "find",
        params: [
          { collection: "plans" },
          { size: "20" },
          { page: "0" },
          { project: JSON.stringify({"name": 1}) },
          { query: JSON.stringify(query) },
        ]
      }];

      return apiBillRun(request).then(
        success => {
          const options = _.values(success.data[0].data.details);
          return { options };
        },
        failure => {return { options : [] }}
      );
    } else {
      callback(null, { options: []});
    }
  }

  render() {
    return (
      <div className="PlanSearch">
        <Select
            value={this.state.val}
            cacheAsyncResults={false}
            onChange={this.onSelectPlan}
            asyncOptions={this.getPlans}
            valueKey='name'
            labelKey='name'
            placeholder='Search by plan name...'
            noResultsText='No plans found, please try another name'
        />
      </div>
    );
  }
}
