import React, { Component, PropTypes } from 'react';
import BasicPlanSettings from './BasicPlanSettings';
import PlanTrial from './PlanTrial';
import PlanRecurring from './PlanRecurring';

export default class StepOne extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <BasicPlanSettings />
        <hr/>
        <PlanTrial />
        <hr/>
        <PlanRecurring />
      </div>
    );
  }
}
