import React, { Component, PropTypes } from 'react';
import { Multistep } from '../vendor/Multistep';
import StepOne from './StepOne';
import StepTwo from './StepTwo';

export default class PlanSetup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let steps = [
      {name: "PlanSetup", component: <StepOne />},
      {name: "Pricing", component: <StepTwo />}
    ];

    return (
      <div className="container">
        <Multistep steps={steps} />
      </div>
    );
  }
}
