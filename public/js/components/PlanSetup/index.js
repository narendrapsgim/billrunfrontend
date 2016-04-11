import React, { Component, PropTypes } from 'react';
import { Multistep } from '../vendor/Multistep';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

export default class PlanSetup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let steps = [
      {name: "Plan Setup", component: <StepOne />},
      {name: "Pricing", component: <StepTwo />},
      {name: "Add Discount or Coupon", component: <StepThree />}
    ];

    return (
      <div className="PlanSetup">
        <h3>Billing Plan</h3>
        <Multistep steps={steps} />
      </div>
    );
  }
}
